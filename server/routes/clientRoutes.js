import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getFeedback,
  bookSkilledWorker,
  getBookings,
  addToFavorites,
  getFavorites,
} from "../controllers/ClientControllers/clientController.js";

import {
  getTopRatedWorkers,
  getSkilledWorkerDetails,
} from "../controllers/ClientControllers/serviceController.js";

// not yet used
router.get("/get-feedback", requireAuth, getFeedback);
router.get("/get-bookings", requireAuth, getBookings);
router.get("/get-top-rated-workers", requireAuth, getTopRatedWorkers);
router.get("/get-favorites", requireAuth, getFavorites);

router.post("/get-worker-details", requireAuth, getSkilledWorkerDetails);
router.post("/book-skilled-worker", requireAuth, bookSkilledWorker);



router.post("/add-to-favorites", requireAuth, addToFavorites);
export default router;
