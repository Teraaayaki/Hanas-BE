import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getRequests,
  getClients,
  getWorkers,
  getTransactions,
  getReports,
} from "../controllers/AdminControllers/adminController.js";

// // not yet used
router.get("/get-requests", requireAuth, getRequests);
router.get("/get-clients", requireAuth, getClients);
router.get("/get-workers", requireAuth, getWorkers);
router.get("/get-transactions", requireAuth, getTransactions);
router.get("/get-reports", requireAuth, getReports);

export default router;
