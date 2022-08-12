import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getNotifications,
  changeNotificationStatus,
  registerPushNotifToken,
} from "../controllers/notificationController.js";

router.get("/", requireAuth, getNotifications);
router.patch("/:id", requireAuth, changeNotificationStatus);
router.post("/", requireAuth, registerPushNotifToken);
export default router;
