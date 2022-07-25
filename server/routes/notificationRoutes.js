import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getNotifications,
  changeNotificationStatus,
} from "../controllers/notificationController.js";

router.get("/", requireAuth, getNotifications);
router.patch("/:id", requireAuth, changeNotificationStatus);

export default router;
