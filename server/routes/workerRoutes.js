import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { getServices } from "../controllers/WorkerControllers/workerController.js";

router.get("/get-services", requireAuth, getServices);

export default router;
