import Message from '../models/Message.model.js';
import User from '../models/User.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';
import { emitToUser, getIO } from '../config/socket.js';

// @desc    Get all conversations
// @route   GET /api/messages/conversations
export const getConversations = async (req, res, next) => {
  try {
    // Get all unique conversation IDs for the user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
          deletedFor: { $nin: [req.user._id] },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $ne: ['$status', 'read'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // Populate other user info
    const conversations = await Promise.all(
      messages.map(async (msg) => {
        const otherUserId =
          msg.lastMessage.sender.toString() === req.user._id.toString()
            ? msg.lastMessage.receiver
            : msg.lastMessage.sender;

        const otherUser = await User.findById(otherUserId).select(
          'firstName lastName username profilePicture headline'
        );

        return {
          conversationId: msg._id,
          otherUser,
          lastMessage: {
            content: msg.lastMessage.deletedForEveryone
              ? 'This message was deleted.'
              : msg.lastMessage.content,
            messageType: msg.lastMessage.messageType,
            createdAt: msg.lastMessage.createdAt,
            sender: msg.lastMessage.sender,
          },
          unreadCount: msg.unreadCount,
        };
      })
    );

    return successResponse(res, { conversations }, 'Conversations fetched.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages with a user
// @route   GET /api/messages/:userId
export const getMessages = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 50;

    const conversationId = Message.getConversationId(req.user._id, req.params.userId);

    let query = {
      conversationId,
      deletedFor: { $nin: [req.user._id] },
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        status: { $ne: 'read' },
      },
      { status: 'read' }
    );

    // Notify sender that messages are read
    emitToUser(req.params.userId, 'chat:read', { conversationId, readBy: req.user._id });

    const nextCursor = messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : null;

    return successResponse(
      res,
      { messages: messages.reverse() },
      'Messages fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages/:userId
export const sendMessage = async (req, res, next) => {
  try {
    const receiverId = req.params.userId;

    const receiver = await User.findById(receiverId);
    if (!receiver) return errorResponse(res, 'User not found.', 404);

    // Check if blocked
    if (receiver.blockedUsers.includes(req.user._id)) {
      return errorResponse(res, 'Cannot send message to this user.', 403);
    }

    const conversationId = Message.getConversationId(req.user._id, receiverId);

    const messageData = {
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content: req.body.content,
      messageType: req.body.messageType || 'text',
    };

    if (req.body.media) {
      messageData.media = req.body.media;
    }

    const message = await Message.create(messageData);
    await message.populate('sender', 'firstName lastName username profilePicture');

    // Real-time: emit to receiver
    const io = getIO();
    io.to(conversationId).emit('chat:message', message);
    emitToUser(receiverId, 'chat:new-message', {
      message,
      conversationId,
    });

    return successResponse(res, { message }, 'Message sent.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const { deleteForEveryone } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) return errorResponse(res, 'Message not found.', 404);

    if (deleteForEveryone) {
      if (message.sender.toString() !== req.user._id.toString()) {
        return errorResponse(res, 'Can only delete own messages for everyone.', 403);
      }
      message.deletedForEveryone = true;
      message.content = '';
      await message.save();

      // Notify other user
      const io = getIO();
      io.to(message.conversationId).emit('chat:message-deleted', {
        messageId: message._id,
        deletedForEveryone: true,
      });
    } else {
      message.deletedFor.push(req.user._id);
      await message.save();
    }

    return successResponse(res, null, 'Message deleted.');
  } catch (error) {
    next(error);
  }
};
