import express from 'express';
import {
  editComment,
  deleteComment,
  likeComment,
  replyToComment,
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/:id', protect, editComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);
router.post('/:id/reply', protect, replyToComment);

export default router;
