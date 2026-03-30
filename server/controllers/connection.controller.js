import Connection from '../models/Connection.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';
import { emitToUser } from '../config/socket.js';

// @desc    Send connection request
// @route   POST /api/connections/request/:id
export const sendConnectionRequest = async (req, res, next) => {
  try {
    const recipientId = req.params.id;

    if (recipientId === req.user._id.toString()) {
      return errorResponse(res, 'Cannot connect with yourself.', 400);
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return errorResponse(res, 'User not found.', 404);

    // Check if already connected or pending
    const existing = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return errorResponse(res, 'Already connected.', 400);
      }
      if (existing.status === 'pending') {
        return errorResponse(res, 'Connection request already pending.', 400);
      }
      if (existing.status === 'declined') {
        // Allow re-request after decline
        existing.status = 'pending';
        existing.requester = req.user._id;
        existing.recipient = recipientId;
        existing.note = req.body.note || '';
        await existing.save();

        const notification = await Notification.create({
          recipient: recipientId,
          sender: req.user._id,
          type: 'connection_request',
          message: `${req.user.firstName} ${req.user.lastName} wants to connect.`,
        });
        emitToUser(recipientId, 'notification:new', notification);

        return successResponse(res, { connection: existing }, 'Connection request sent.');
      }
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId,
      note: req.body.note || '',
    });

    // Notification
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'connection_request',
      message: `${req.user.firstName} ${req.user.lastName} wants to connect.`,
    });
    emitToUser(recipientId, 'notification:new', notification);

    return successResponse(res, { connection }, 'Connection request sent.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Accept connection request
// @route   POST /api/connections/accept/:id
export const acceptConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      recipient: req.user._id,
      status: 'pending',
    });

    if (!connection) {
      return errorResponse(res, 'Connection request not found.', 404);
    }

    connection.status = 'accepted';
    await connection.save();

    // Auto-follow each other
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: connection.requester, followers: connection.requester },
      $inc: { followingCount: 1, followersCount: 1, connectionsCount: 1 },
    });

    await User.findByIdAndUpdate(connection.requester, {
      $addToSet: { following: req.user._id, followers: req.user._id },
      $inc: { followingCount: 1, followersCount: 1, connectionsCount: 1 },
    });

    // Notification
    const notification = await Notification.create({
      recipient: connection.requester,
      sender: req.user._id,
      type: 'connection_accepted',
      message: `${req.user.firstName} ${req.user.lastName} accepted your connection request.`,
    });
    emitToUser(connection.requester, 'notification:new', notification);

    return successResponse(res, { connection }, 'Connection accepted.');
  } catch (error) {
    next(error);
  }
};

// @desc    Decline connection request
// @route   POST /api/connections/decline/:id
export const declineConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      recipient: req.user._id,
      status: 'pending',
    });

    if (!connection) {
      return errorResponse(res, 'Connection request not found.', 404);
    }

    connection.status = 'declined';
    await connection.save();

    return successResponse(res, null, 'Connection declined.');
  } catch (error) {
    next(error);
  }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:id
export const removeConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: 'accepted',
    });

    if (!connection) {
      return errorResponse(res, 'Connection not found.', 404);
    }

    const otherUserId =
      connection.requester.toString() === req.user._id.toString()
        ? connection.recipient
        : connection.requester;

    // Remove mutual follow
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: otherUserId, followers: otherUserId },
      $inc: { followingCount: -1, followersCount: -1, connectionsCount: -1 },
    });

    await User.findByIdAndUpdate(otherUserId, {
      $pull: { following: req.user._id, followers: req.user._id },
      $inc: { followingCount: -1, followersCount: -1, connectionsCount: -1 },
    });

    await Connection.findByIdAndDelete(req.params.id);

    return successResponse(res, null, 'Connection removed.');
  } catch (error) {
    next(error);
  }
};

// @desc    Follow user
// @route   POST /api/follow/:id
export const followUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return errorResponse(res, 'Cannot follow yourself.', 400);
    }

    const target = await User.findById(targetId);
    if (!target) return errorResponse(res, 'User not found.', 404);

    const currentUser = await User.findById(req.user._id);
    if (currentUser.following.includes(targetId)) {
      return errorResponse(res, 'Already following.', 400);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: targetId },
      $inc: { followingCount: 1 },
    });

    await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: req.user._id },
      $inc: { followersCount: 1 },
    });

    // Notification
    const notification = await Notification.create({
      recipient: targetId,
      sender: req.user._id,
      type: 'follow',
      message: `${req.user.firstName} ${req.user.lastName} started following you.`,
    });
    emitToUser(targetId, 'notification:new', notification);

    return successResponse(res, null, 'Following user.');
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow user
// @route   DELETE /api/follow/:id
export const unfollowUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: targetId },
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: req.user._id },
      $inc: { followersCount: -1 },
    });

    return successResponse(res, null, 'Unfollowed user.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending connection requests
// @route   GET /api/connections/pending
export const getPendingRequests = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    let query = {
      recipient: req.user._id,
      status: 'pending',
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const requests = await Connection.find(query)
      .populate('requester', 'firstName lastName username headline profilePicture location')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = requests.length > limit;
    if (hasMore) requests.pop();

    const nextCursor = requests.length > 0 ? requests[requests.length - 1].createdAt.toISOString() : null;

    return successResponse(
      res,
      { requests },
      'Pending requests fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get connection suggestions
// @route   GET /api/connections/suggestions
export const getConnectionSuggestions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const currentUser = await User.findById(req.user._id);

    // Get existing connections
    const existingConnections = await Connection.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
      status: { $in: ['pending', 'accepted'] },
    });

    const excludeIds = [
      req.user._id,
      ...existingConnections.map((c) =>
        c.requester.toString() === req.user._id.toString() ? c.recipient : c.requester
      ),
      ...currentUser.blockedUsers,
    ];

    // Find users with similar skills or location
    const suggestions = await User.find({
      _id: { $nin: excludeIds },
      $or: [
        { skills: { $in: currentUser.skills } },
        { location: currentUser.location },
      ],
    })
      .select('firstName lastName username headline profilePicture location skills connectionsCount')
      .limit(limit)
      .sort({ connectionsCount: -1 });

    return successResponse(res, { suggestions }, 'Suggestions fetched.');
  } catch (error) {
    next(error);
  }
};
