import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  uploadBannerImage,
  updateExperience,
  updateEducation,
  updateSkills,
  updateProjects,
  getSuggestions,
  getFollowers,
  getFollowing,
  searchUsers,
} from '../controllers/user.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.get('/:username', optionalAuth, getUserProfile);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);

router.put('/me', protect, updateProfile);
router.put('/me/picture', protect, uploadLimiter, uploadSingle('profilePicture'), uploadProfilePicture);
router.put('/me/banner', protect, uploadLimiter, uploadSingle('bannerImage'), uploadBannerImage);
router.put('/me/experience', protect, updateExperience);
router.put('/me/education', protect, updateEducation);
router.put('/me/skills', protect, updateSkills);
router.put('/me/projects', protect, updateProjects);

export default router;
