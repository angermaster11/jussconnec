import Notification from '../models/Notification.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';

// @desc    Get all notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    let query = { recipient: req.user._id };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName username profilePicture')
      .populate('post', 'content postType')
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    const hasMore = notifications.length > limit;
    if (hasMore) notifications.pop();

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    const nextCursor = notifications.length > 0
      ? notifications[notifications.length - 1].createdAt.toISOString()
      : null;

    return successResponse(
      res,
      { notifications, unreadCount },
      'Notifications fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    return successResponse(res, null, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

// @desc    Mark one as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return errorResponse(res, 'Notification not found.', 404);
    }

    return successResponse(res, { notification }, 'Notification marked as read.');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found.', 404);
    }

    return successResponse(res, null, 'Notification deleted.');
  } catch (error) {
    next(error);
  }
};
