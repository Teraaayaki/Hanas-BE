import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  getServices,
  uploadImageService,
  deleteImageService,
  uploadImageCertificate,
  deleteImageCertificate,
} from "../controllers/WorkerControllers/workerController.js";

router.get("/get-services", requireAuth, getServices);
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
