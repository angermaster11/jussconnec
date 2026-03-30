import Post from '../models/Post.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { emitToUser } from '../config/socket.js';

// @desc    Get feed (paginated, cursor-based)
// @route   GET /api/posts/feed
export const getFeed = async (req, res, next) => {
  try {
    const { cursor, limit: limitStr, filter } = req.query;
    const limit = parseInt(limitStr) || 20;

    const currentUser = await User.findById(req.user._id);
    let authorFilter;

    switch (filter) {
      case 'following':
        authorFilter = { $in: currentUser.following };
        break;
      case 'connections':
        // Get connected user IDs
        const Connection = (await import('../models/Connection.model.js')).default;
        const connections = await Connection.find({
          $or: [
            { requester: req.user._id, status: 'accepted' },
            { recipient: req.user._id, status: 'accepted' },
          ],
        });
        const connectionIds = connections.map((c) =>
          c.requester.toString() === req.user._id.toString() ? c.recipient : c.requester
        );
        authorFilter = { $in: connectionIds };
        break;
      default:
        // All: following + connections + public posts
        authorFilter = { $in: [...currentUser.following, req.user._id] };
    }

    let query = {
      $or: [
        { author: authorFilter },
        { visibility: 'public' },
      ],
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(query)
      .populate('author', 'firstName lastName username headline profilePicture')
      .populate('originalPost')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    // Populate original post author if repost
    for (const post of posts) {
      if (post.originalPost) {
        await post.populate('originalPost.author', 'firstName lastName username headline profilePicture');
      }
    }

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

    return successResponse(
      res,
      { posts },
      'Feed fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName username headline profilePicture')
      .populate('originalPost')
      .populate('mentions', 'firstName lastName username');

    if (!post) {
      return errorResponse(res, 'Post not found.', 404);
    }

    return successResponse(res, { post }, 'Post fetched.');
  } catch (error) {
    next(error);
  }
};

// @desc    Create post
// @route   POST /api/posts
export const createPost = async (req, res, next) => {
  try {
    const { content, postType, visibility, location, hashtags, mentions, poll } = req.body;

    const postData = {
      author: req.user._id,
      content,
      postType: postType || 'text',
      visibility: visibility || 'public',
      location,
      hashtags: hashtags ? (typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags) : [],
      mentions: mentions ? (typeof mentions === 'string' ? JSON.parse(mentions) : mentions) : [],
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const mediaPromises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, 'jussconnecc/posts');
        return {
          url: result.secure_url,
          publicId: result.public_id,
          type: file.mimetype.startsWith('video/') ? 'video' : 
                file.mimetype === 'application/pdf' ? 'document' : 'image',
        };
      });
      postData.media = await Promise.all(mediaPromises);
      
      if (!postData.postType || postData.postType === 'text') {
        postData.postType = postData.media[0].type;
      }
    }

    // Handle poll
    if (postType === 'poll' && poll) {
      const pollData = typeof poll === 'string' ? JSON.parse(poll) : poll;
      postData.poll = {
        question: pollData.question,
        options: pollData.options.map((opt) => ({ text: opt, votes: [], votesCount: 0 })),
        endsAt: pollData.endsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalVotes: 0,
      };
    }

    const post = await Post.create(postData);
    await post.populate('author', 'firstName lastName username headline profilePicture');

    // Create notifications for mentioned users
    if (postData.mentions.length > 0) {
      const notifications = postData.mentions.map((userId) => ({
        recipient: userId,
        sender: req.user._id,
        type: 'mention',
        message: `${req.user.firstName} mentioned you in a post.`,
        post: post._id,
      }));
      await Notification.insertMany(notifications);
      
      // Emit real-time notifications
      for (const n of notifications) {
        emitToUser(n.recipient, 'notification:new', n);
      }
    }

    return successResponse(res, { post }, 'Post created.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);
    if (post.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    const { content, visibility, hashtags, location } = req.body;
    if (content !== undefined) post.content = content;
    if (visibility) post.visibility = visibility;
    if (hashtags) post.hashtags = typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags;
    if (location !== undefined) post.location = location;

    post.isEdited = true;
    post.editedAt = new Date();
    await post.save();

    await post.populate('author', 'firstName lastName username headline profilePicture');

    return successResponse(res, { post }, 'Post updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized.', 403);
    }

    await Post.findByIdAndDelete(req.params.id);

    // Also delete associated comments
    const Comment = (await import('../models/Comment.model.js')).default;
    await Comment.deleteMany({ post: req.params.id });

    return successResponse(res, null, 'Post deleted.');
  } catch (error) {
    next(error);
  }
};

// @desc    React to post
// @route   POST /api/posts/:id/react
export const reactToPost = async (req, res, next) => {
  try {
    const { type } = req.body; // like, love, insightful, celebrate, curious
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);

    // Remove existing reaction first
    const existingIdx = post.reactions.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingIdx > -1) {
      const oldType = post.reactions[existingIdx].type;
      post.reactionsCount[oldType] = Math.max(0, (post.reactionsCount[oldType] || 0) - 1);
      post.reactions.splice(existingIdx, 1);
      post.reactionsCount.total = Math.max(0, (post.reactionsCount.total || 0) - 1);
    }

    // Add new reaction
    post.reactions.push({ user: req.user._id, type });
    post.reactionsCount[type] = (post.reactionsCount[type] || 0) + 1;
    post.reactionsCount.total = (post.reactionsCount.total || 0) + 1;
    await post.save();

    // Send notification (if not own post)
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        message: `${req.user.firstName} reacted to your post.`,
        post: post._id,
      });
      emitToUser(post.author, 'notification:new', notification);
    }

    return successResponse(res, { reactionsCount: post.reactionsCount }, 'Reacted to post.');
  } catch (error) {
    next(error);
  }
};

// @desc    Remove reaction
// @route   DELETE /api/posts/:id/react
export const removeReaction = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);

    const reactionIdx = post.reactions.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reactionIdx === -1) {
      return errorResponse(res, 'No reaction to remove.', 400);
    }

    const reactionType = post.reactions[reactionIdx].type;
    post.reactionsCount[reactionType] = Math.max(0, (post.reactionsCount[reactionType] || 0) - 1);
    post.reactionsCount.total = Math.max(0, (post.reactionsCount.total || 0) - 1);
    post.reactions.splice(reactionIdx, 1);
    await post.save();

    return successResponse(res, { reactionsCount: post.reactionsCount }, 'Reaction removed.');
  } catch (error) {
    next(error);
  }
};

// @desc    Repost
// @route   POST /api/posts/:id/repost
export const repostPost = async (req, res, next) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) return errorResponse(res, 'Post not found.', 404);

    const repost = await Post.create({
      author: req.user._id,
      postType: 'repost',
      originalPost: originalPost._id,
      repostComment: req.body.comment || '',
      visibility: req.body.visibility || 'public',
    });

    originalPost.repostsCount = (originalPost.repostsCount || 0) + 1;
    await originalPost.save();

    await repost.populate('author', 'firstName lastName username headline profilePicture');
    await repost.populate('originalPost');

    // Notification
    if (originalPost.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: originalPost.author,
        sender: req.user._id,
        type: 'repost',
        message: `${req.user.firstName} reposted your post.`,
        post: originalPost._id,
      });
      emitToUser(originalPost.author, 'notification:new', notification);
    }

    return successResponse(res, { post: repost }, 'Reposted.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reactions on a post
// @route   GET /api/posts/:id/reactions
export const getReactions = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('reactions.user', 'firstName lastName username profilePicture headline');

    if (!post) return errorResponse(res, 'Post not found.', 404);

    return successResponse(res, {
      reactions: post.reactions,
      reactionsCount: post.reactionsCount,
    }, 'Reactions fetched.');
  } catch (error) {
    next(error);
  }
};

// @desc    Save/bookmark post
// @route   POST /api/posts/:id/save
export const savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 'Post not found.', 404);

    const user = await User.findById(req.user._id);
    const savedIdx = user.savedPosts.indexOf(post._id);

    if (savedIdx > -1) {
      user.savedPosts.splice(savedIdx, 1);
      post.savesCount = Math.max(0, (post.savesCount || 0) - 1);
      await Promise.all([user.save({ validateBeforeSave: false }), post.save()]);
      return successResponse(res, { saved: false }, 'Post unsaved.');
    }

    user.savedPosts.push(post._id);
    post.savesCount = (post.savesCount || 0) + 1;
    await Promise.all([user.save({ validateBeforeSave: false }), post.save()]);

    return successResponse(res, { saved: true }, 'Post saved.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved posts
// @route   GET /api/posts/saved
export const getSavedPosts = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    const user = await User.findById(req.user._id);

    let query = { _id: { $in: user.savedPosts } };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await Post.find(query)
      .populate('author', 'firstName lastName username headline profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

    return successResponse(
      res,
      { posts },
      'Saved posts fetched.',
      200,
      paginationMeta(user.savedPosts.length, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};
