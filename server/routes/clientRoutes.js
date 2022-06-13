import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();


import {
  getFeedback,
  bookSkilledWorker,
  getBookings,
  removeScheduleClient,
  removeCancelledBooking,
  cancelBookingSchedule,
  giveFeedback,
} from "../controllers/ClientControllers/clientController.js";

import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../controllers/ClientControllers/favoritesController.js";

import {
  getTopRatedWorkers,
  getSkilledWorkerDetails,
  getTopServices,
  getSkilledWorkerWithSpecificService,
  getAllServices,
} from "../controllers/ClientControllers/serviceController.js";

// not yet used
router.get("/get-feedback", requireAuth, getFeedback);

router.get("/get-bookings", requireAuth, getBookings);
router.get("/get-top-rated-workers", requireAuth, getTopRatedWorkers);
router.get("/get-favorites", requireAuth, getFavorites);
router.get("/get-top-services", requireAuth, getTopServices);
router.get("/get-all-services", requireAuth, getAllServices);

router.post("/get-worker-details", requireAuth, getSkilledWorkerDetails);
router.post("/book-skilled-worker", requireAuth, bookSkilledWorker);
router.post("/remove-schedule", requireAuth, removeScheduleClient);
router.post("/remove-cancelled-booking", requireAuth, removeCancelledBooking);
router.post("/cancel-booking-schedule", requireAuth, cancelBookingSchedule);
router.post(
  "/get-worker-with-specific-service",
  requireAuth,
  getSkilledWorkerWithSpecificService
);
router.post("/give-feedback", requireAuth, giveFeedback);
router.post("/add-to-favorites", requireAuth, addToFavorites);
router.post("/remove-from-favorites", requireAuth, removeFromFavorites);
export default router;
