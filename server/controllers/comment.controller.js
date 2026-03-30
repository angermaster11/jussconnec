import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';
import Notification from '../models/Notification.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';
import { emitToUser } from '../config/socket.js';

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
export const getComments = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    let query = {
      post: req.params.id,
      parentComment: null, // Top-level comments only
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const comments = await Comment.find(query)
      .populate('author', 'firstName lastName username profilePicture headline')
      .populate('mentions', 'firstName lastName username')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = comments.length > limit;
    if (hasMore) comments.pop();

    // Get replies for each comment (first 3)
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'firstName lastName username profilePicture headline')
          .sort({ createdAt: 1 })
          .limit(3);
        return { ...comment.toObject(), replies };
      })
    );

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].createdAt.toISOString() : null;

    return successResponse(
      res,
      { comments: commentsWithReplies },
      'Comments fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment
// @route   POST /api/posts/:id/comments
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);

    const { content, mentions } = req.body;

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content,
      mentions: mentions || [],
    });

    // Update post comment count
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    await comment.populate('author', 'firstName lastName username profilePicture headline');

    // Notification to post author
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        message: `${req.user.firstName} commented on your post.`,
        post: post._id,
        comment: comment._id,
      });
      emitToUser(post.author, 'notification:new', notification);
    }

    return successResponse(res, { comment }, 'Comment added.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit comment
// @route   PUT /api/comments/:id
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return errorResponse(res, 'Comment not found.', 404);
    if (comment.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('author', 'firstName lastName username profilePicture headline');

    return successResponse(res, { comment }, 'Comment updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return errorResponse(res, 'Comment not found.', 404);
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized.', 403);
    }

    // Update post comment count
    const post = await Post.findById(comment.post);
    if (post) {
      post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
      await post.save();
    }

    // Delete replies too
    const repliesCount = await Comment.countDocuments({ parentComment: comment._id });
    await Comment.deleteMany({ parentComment: comment._id });
    
    if (post && repliesCount > 0) {
      post.commentsCount = Math.max(0, post.commentsCount - repliesCount);
      await post.save();
    }

    await Comment.findByIdAndDelete(req.params.id);

    return successResponse(res, null, 'Comment deleted.');
  } catch (error) {
    next(error);
  }
};

// @desc    Like comment
// @route   POST /api/comments/:id/like
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return errorResponse(res, 'Comment not found.', 404);

    const likeIdx = comment.likes.indexOf(req.user._id);

    if (likeIdx > -1) {
      comment.likes.splice(likeIdx, 1);
      comment.likesCount = Math.max(0, (comment.likesCount || 0) - 1);
    } else {
      comment.likes.push(req.user._id);
      comment.likesCount = (comment.likesCount || 0) + 1;
    }

    await comment.save();

    return successResponse(res, {
      liked: likeIdx === -1,
      likesCount: comment.likesCount,
    }, likeIdx === -1 ? 'Comment liked.' : 'Comment unliked.');
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to comment
// @route   POST /api/comments/:id/reply
export const replyToComment = async (req, res, next) => {
  try {
    const parentComment = await Comment.findById(req.params.id).populate('author');
    if (!parentComment) return errorResponse(res, 'Comment not found.', 404);

    const { content, mentions } = req.body;

    const reply = await Comment.create({
      post: parentComment.post,
      author: req.user._id,
      content,
      parentComment: parentComment._id,
      mentions: mentions || [],
    });

    parentComment.repliesCount = (parentComment.repliesCount || 0) + 1;
    await parentComment.save();

    // Update post comment count
    const post = await Post.findById(parentComment.post);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      await post.save();
    }

    await reply.populate('author', 'firstName lastName username profilePicture headline');

    // Notification to comment author
    if (parentComment.author._id.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: parentComment.author._id,
        sender: req.user._id,
        type: 'reply',
        message: `${req.user.firstName} replied to your comment.`,
        post: parentComment.post,
        comment: reply._id,
      });
      emitToUser(parentComment.author._id, 'notification:new', notification);
    }

    return successResponse(res, { reply }, 'Reply added.', 201);
  } catch (error) {
    next(error);
  }
};
