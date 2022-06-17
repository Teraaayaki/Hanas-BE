import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getConversations,
  getMessages,
  storeMessage,
} from "../controllers/conversationController.js";

router.get("/", requireAuth, getConversations);
router.get("/:id", requireAuth, getMessages);
router.post("/", requireAuth, storeMessage);

export default router;
