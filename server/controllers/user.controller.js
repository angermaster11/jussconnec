import User from '../models/User.model.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get user profile by username
// @route   GET /api/users/:username
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-refreshToken -verificationToken -resetPasswordToken -blockedUsers -savedPosts');

    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    // Check privacy settings
    if (user.settings.privacy.profileVisibility === 'private' && 
        (!req.user || req.user._id.toString() !== user._id.toString())) {
      return successResponse(res, {
        user: {
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          headline: user.headline,
          isPrivate: true,
        }
      }, 'Profile is private.');
    }

    return successResponse(res, { user }, 'Profile fetched.');
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'headline', 'bio', 'location',
      'website', 'pronouns', 'openToWork', 'settings',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken -verificationToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Profile updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   PUT /api/users/me/picture
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload an image.', 400);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'jussconnecc/profiles');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Profile picture updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Upload banner image
// @route   PUT /api/users/me/banner
export const uploadBannerImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload an image.', 400);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'jussconnecc/banners');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bannerImage: result.secure_url },
      { new: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Banner image updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update experience
// @route   PUT /api/users/me/experience
export const updateExperience = async (req, res, next) => {
  try {
    const { experience } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { experience },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Experience updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update education
// @route   PUT /api/users/me/education
export const updateEducation = async (req, res, next) => {
  try {
    const { education } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { education },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Education updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update skills
// @route   PUT /api/users/me/skills
export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Skills updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update projects
// @route   PUT /api/users/me/projects
export const updateProjects = async (req, res, next) => {
  try {
    const { projects } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { projects },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user }, 'Projects updated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get people you may know
// @route   GET /api/users/suggestions
export const getSuggestions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const currentUser = await User.findById(req.user._id);

    // Get users not already connected/following and not blocked
    const excludeIds = [
      req.user._id,
      ...currentUser.following,
      ...currentUser.blockedUsers,
    ];

    const suggestions = await User.find({
      _id: { $nin: excludeIds },
    })
      .select('firstName lastName username headline profilePicture location connectionsCount')
      .limit(limit)
      .sort({ connectionsCount: -1 });

    return successResponse(res, { suggestions }, 'Suggestions fetched.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get user followers
// @route   GET /api/users/:id/followers
export const getFollowers = async (req, res, next) => {
  try {
    const { cursor, limit: limitStr } = req.query;
    const limit = parseInt(limitStr) || 20;

    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    let query = { _id: { $in: user.followers } };
    if (cursor) {
      query._id = { ...query._id, $lt: cursor };
    }

    const followers = await User.find(query)
      .select('firstName lastName username headline profilePicture')
      .limit(limit + 1)
      .sort({ _id: -1 });

    const hasMore = followers.length > limit;
    if (hasMore) followers.pop();

    const nextCursor = followers.length > 0 ? followers[followers.length - 1]._id : null;

    return successResponse(
      res,
      { followers },
      'Followers fetched.',
      200,
      paginationMeta(user.followersCount, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user following
// @route   GET /api/users/:id/following
export const getFollowing = async (req, res, next) => {
  try {
    const { cursor, limit: limitStr } = req.query;
    const limit = parseInt(limitStr) || 20;

    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    let query = { _id: { $in: user.following } };
    if (cursor) {
      query._id = { ...query._id, $lt: cursor };
    }

    const following = await User.find(query)
      .select('firstName lastName username headline profilePicture')
      .limit(limit + 1)
      .sort({ _id: -1 });

    const hasMore = following.length > limit;
    if (hasMore) following.pop();

    const nextCursor = following.length > 0 ? following[following.length - 1]._id : null;

    return successResponse(
      res,
      { following },
      'Following list fetched.',
      200,
      paginationMeta(user.followingCount, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
export const searchUsers = async (req, res, next) => {
  try {
    const { q, location, cursor } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    if (!q) {
      return errorResponse(res, 'Search query is required.', 400);
    }

    let query = {
      $text: { $search: q },
    };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const users = await User.find(query, { score: { $meta: 'textScore' } })
      .select('firstName lastName username headline profilePicture location connectionsCount')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit + 1);

    const hasMore = users.length > limit;
    if (hasMore) users.pop();

    const nextCursor = users.length > 0 ? users[users.length - 1]._id : null;

    return successResponse(
      res,
      { users },
      'Search results fetched.',
      200,
      paginationMeta(null, nextCursor, limit, hasMore)
    );
  } catch (error) {
    next(error);
  }
};
