import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  getServices,
  addService,
  uploadImageService,
  deleteImageService,
  uploadImageCertificate,
  deleteImageCertificate,
} from "../controllers/WorkerControllers/serviceController.js";

// Worker Routes

// Services Routes
router.get("/get-services", requireAuth, getServices);
router.post("/add-service", requireAuth, addService);
router.post(
  "/upload-image-service",
  requireAuth,
  multer.single("sample"),
  uploadImageService
);
router.post(
  "/upload-image-certificate",
  requireAuth,
  multer.single("certificate"),
  uploadImageCertificate
);
router.post("/delete-image-service", requireAuth, deleteImageService);
router.post("/delete-image-certificate", requireAuth, deleteImageCertificate);

export default router;
