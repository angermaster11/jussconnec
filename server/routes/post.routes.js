import express from 'express';
import {
  getFeed,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
  removeReaction,
  repostPost,
  getReactions,
  savePost,
  getSavedPosts,
} from '../controllers/post.controller.js';
import { getComments, addComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/feed', protect, getFeed);
router.get('/saved', protect, getSavedPosts);
router.get('/:id', protect, getPost);
router.post('/', protect, uploadMultiple('media', 10), createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/react', protect, reactToPost);
router.delete('/:id/react', protect, removeReaction);
router.post('/:id/repost', protect, repostPost);
router.get('/:id/reactions', protect, getReactions);
router.post('/:id/save', protect, savePost);

// Comments on posts
router.get('/:id/comments', protect, getComments);
router.post('/:id/comments', protect, addComment);

export default router;
