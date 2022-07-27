import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import multer from "../helpers/multer.js";
const router = express.Router();

import {
  getFeedback,
  createVerificationRequest,
} from "../controllers/WorkerControllers/workerController.js";

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

import {
  getBookingRequests,
  acceptBookingRequest,
  declineBookingRequest,
} from "../controllers/WorkerControllers/bookingRequestsController.js";

import { getAcceptedBookings } from "../controllers/WorkerControllers/scheduleController.js";
import { getTransactions } from "../controllers/transactionController.js";
import { getAchievements } from "../controllers/WorkerControllers/achievementController.js";
import {
  getOverviewData,
  getUpcomingServices,
  startService,
  serviceFinished,
  getOngoingService,
} from "../controllers/WorkerControllers/dashboardController.js";

// Worker Routes
router.get("/get-feedback", requireAuth, getFeedback);

// Achievement Routes
router.get("/get-achievements", requireAuth, getAchievements);

// Services Routes
router.get("/get-services", requireAuth, getServices);
router.get("/get-my-services", requireAuth, getMyServices);
router.post("/edit-service", requireAuth, editServices);
router.post("/add-service", requireAuth, addService);
router.post(
  "/upload-image-service",
  requireAuth,
  multer.single("sample"),
  uploadImageService,
);
router.post(
  "/upload-image-certificate",
  requireAuth,
  multer.single("certificate"),
  uploadImageCertificate,
);
router.post("/delete-image-service", requireAuth, deleteImageService);
router.post("/delete-image-certificate", requireAuth, deleteImageCertificate);
router.post(
  "/create-verification-request",
  requireAuth,
  multer.fields([{ name: "validId" }, { name: "clearance" }]),
  createVerificationRequest,
);

//Booking Routes
router.get("/booking-requests", requireAuth, getBookingRequests);
router.patch("/accept-booking/:id", requireAuth, acceptBookingRequest);
router.patch("/decline-booking/:id", requireAuth, declineBookingRequest);
router.get("/accepted-bookings", requireAuth, getAcceptedBookings);
router.get("/overview", requireAuth, getOverviewData);
router.get("/upcoming-services", requireAuth, getUpcomingServices);
router.get("/ongoing-service", requireAuth, getOngoingService);
router.patch("/start-service/:id", requireAuth, startService);
router.patch("/service-finished/:id", requireAuth, serviceFinished);

export default router;
