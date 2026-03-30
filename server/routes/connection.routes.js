import express from 'express';
import {
  sendConnectionRequest,
  acceptConnection,
  declineConnection,
  removeConnection,
  followUser,
  unfollowUser,
  getPendingRequests,
  getConnectionSuggestions,
} from '../controllers/connection.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/pending', protect, getPendingRequests);
router.get('/suggestions', protect, getConnectionSuggestions);
router.post('/request/:id', protect, sendConnectionRequest);
router.post('/accept/:id', protect, acceptConnection);
router.post('/decline/:id', protect, declineConnection);
router.delete('/:id', protect, removeConnection);

export default router;

// Follow routes are separate - exported for use in server.js
export const followRouter = express.Router();
followRouter.post('/:id', protect, followUser);
followRouter.delete('/:id', protect, unfollowUser);
