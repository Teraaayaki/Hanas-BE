import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { getFeedback } from "../controllers/ClientControllers/clientController.js";

import { getTopRatedWorkers, getSkilledWorkerDetails } from "../controllers/ClientControllers/serviceController.js";
// not yet used
router.get("/get-feedback", requireAuth, getFeedback);

router.get("/get-top-rated-workers", requireAuth, getTopRatedWorkers);

router.get("/get-worker-details", requireAuth, getSkilledWorkerDetails);

export default router;
