import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  getVerifications,
  getVerification,
  getClients,
  getClient,
  getWorkers,
  getWorker,
  getTransactions,
  getReports,
} from "../controllers/AdminControllers/adminController.js";

// // not yet used
router.get("/get-verifications", requireAuth, getVerifications);
router.get("/get-verification/:id", requireAuth, getVerification);
router.get("/get-clients", requireAuth, getClients);
router.get("/get-client/:id", requireAuth, getClient);
router.get("/get-workers", requireAuth, getWorkers);
router.get("/get-worker/:id", requireAuth, getWorker);
router.get("/get-transactions", requireAuth, getTransactions);
router.get("/get-reports", requireAuth, getReports);

export default router;
