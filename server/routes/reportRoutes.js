import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  uploadImageAttachment,
  createReport,
} from "../controllers/reportController.js";

router.post("/", requireAuth, createReport);
router.post(
  "/upload-image",
  requireAuth,
  multer.any("images"),
  uploadImageAttachment
);

export default router;
