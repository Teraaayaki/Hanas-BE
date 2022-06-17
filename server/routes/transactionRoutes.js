import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import { getTransactions } from "../controllers/WorkerControllers/transactionController.js";

router.get("/", requireAuth, getTransactions);

export default router;
