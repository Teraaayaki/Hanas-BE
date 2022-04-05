import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { worker } from "../controllers/WorkerControllers/workerController.js";

router.get("/", requireAuth, worker);

export default router;
