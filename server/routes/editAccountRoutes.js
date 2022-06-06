import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  uploadProfilePicture,
  changeAccountInfo,
  changeAddress,
} from "../controllers/editAccountController.js";

router.post(
  "/upload-profile-image",
  requireAuth,
  multer.single("profile"),
  uploadProfilePicture
);

router.patch("/acount-info", requireAuth, changeAccountInfo);
router.patch("/address", requireAuth, changeAddress);

export default router;
