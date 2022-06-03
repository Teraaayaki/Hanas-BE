import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { uploadProfilePicture } from "../controllers/editAccountController.js";

router.post(
  "/upload-profile-image",
  requireAuth,
  multer.single("profile"),
  uploadProfilePicture
);

export default router;
