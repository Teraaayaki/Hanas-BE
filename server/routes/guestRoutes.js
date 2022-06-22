import express from "express";
const router = express.Router();

import {
  getTopRatedWorkers,
  getTopServices,
  getSkilledWorkerWithSpecificService,
  getAllServices,
  getWorkers,
} from "../controllers/ClientControllers/serviceController.js";

import { getSkilledWorkerDetails } from "../controllers/GuestControllers/guestController.js";

router.get("/get-top-rated-workers/:address", getTopRatedWorkers);
router.get(
  "/get-worker-with-specific-service/:service_type/:address",
  getSkilledWorkerWithSpecificService
);
router.get("/get-workers/:keyword/:address", getWorkers);
router.get("/get-top-services", getTopServices);
router.get("/get-all-services", getAllServices);
router.get(
  "/get-worker-details/:worker_id/:service_id",
  getSkilledWorkerDetails
);

export default router;
