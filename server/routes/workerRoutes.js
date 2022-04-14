import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import { getFeedback } from "../controllers/WorkerControllers/workerController.js";

import {
  getServices,
  getMyServices,
  addService,
  editServices,
  uploadImageService,
  deleteImageService,
  uploadImageCertificate,
  deleteImageCertificate,
} from "../controllers/WorkerControllers/serviceController.js";

// Worker Routes
router.get("/get-feedback", requireAuth, getFeedback);

// Services Routes
router.get("/get-services", requireAuth, getServices);
router.get("/get-my-services", requireAuth, getMyServices);
router.post("/edit-service", requireAuth, editServices);
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
