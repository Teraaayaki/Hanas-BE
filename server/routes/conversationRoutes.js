import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

import {
  getConversations,
  storeMessage
} from '../controllers/conversationController.js';

router.get('/', requireAuth, getConversations);
router.post('/', requireAuth, storeMessage);

export default router;
