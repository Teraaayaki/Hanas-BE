import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getFeedback,
  bookSkilledWorker,
  getBookings,
<<<<<<< HEAD
  removeBooking,
=======
  removeScheduleClient,
  removeCancelledBooking,
  cancelBookingSchedule,
>>>>>>> c791b09c85e83ed3e293abfb752fff25008626b1
} from "../controllers/ClientControllers/clientController.js";

import {
  getTopRatedWorkers,
  getSkilledWorkerDetails,
} from "../controllers/ClientControllers/serviceController.js";

// not yet used
router.get("/get-feedback", requireAuth, getFeedback);
router.get("/get-bookings", requireAuth, getBookings);
router.get("/get-top-rated-workers", requireAuth, getTopRatedWorkers);

router.post("/get-worker-details", requireAuth, getSkilledWorkerDetails);
router.post("/book-skilled-worker", requireAuth, bookSkilledWorker);
router.post("/remove-schedule", requireAuth, removeScheduleClient);
router.post("/remove-cancelled-booking", requireAuth, removeCancelledBooking);
router.post("/cancel-booking-schedule", requireAuth, cancelBookingSchedule);

export default router;
