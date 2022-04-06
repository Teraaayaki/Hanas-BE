import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  getServices,
  uploadImageService,
} from "../controllers/WorkerControllers/workerController.js";

router.get("/get-services", requireAuth, getServices);
router.post(
  "/upload-image-service",
  multer.single("sample"),
  uploadImageService
);
export default router;
