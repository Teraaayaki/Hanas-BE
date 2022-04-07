import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  getServices,
  uploadImageService,
  deleteImageService,
} from "../controllers/WorkerControllers/workerController.js";

router.get("/get-services", requireAuth, getServices);
router.post(
  "/upload-image-service",
  requireAuth,
  multer.single("sample"),
  uploadImageService
);
router.post("/delete-image-service", requireAuth, deleteImageService);
export default router;
