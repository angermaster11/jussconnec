import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/:userId', protect, sendMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
