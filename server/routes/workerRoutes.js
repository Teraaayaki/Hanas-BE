import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { getDetails } from "../controllers/WorkerControllers/workerController.js";

router.get("/get-details", requireAuth, getDetails);

export default router;
