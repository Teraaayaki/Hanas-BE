import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  countPendingVerifications,
  countUsers,
  countPendingReports,
} from "../controllers/AdminControllers/overviewController.js";
import {
  getVerifications,
  getSpecificVerification,
  acceptVerification,
  rejectVerification,
  removeSpecificVerification
} from "../controllers/AdminControllers/verificationController.js";

import {
  getCertifications,
  getCertification,
  acceptCertification,
  rejectCertification,
} from "../controllers/AdminControllers/certificationController.js";

import {
  getClients,
  getClient,
  activateClient,
  deactivateClient,
} from "../controllers/AdminControllers/clientController.js";

import {
  getWorkerList,
  getWorker,
  activateWorker,
  deactivateWorker,
} from "../controllers/AdminControllers/workerController.js";

import {
  getTransactions,
  getSpecificTransaction,
} from "../controllers/AdminControllers/transactionController.js";

import {
  getReports,
  getReport,
  resolveReport,
  rejectReport,
} from "../controllers/AdminControllers/reportController.js";

router.get("/count-verifications", requireAuth, countPendingVerifications);
router.get("/count-users", requireAuth, countUsers);
router.get("/count-reports", requireAuth, countPendingReports);

router.get("/get-verifications", requireAuth, getVerifications);
router.get("/get-verification/:id", requireAuth, getSpecificVerification);
router.post("/accept-verification/:id", requireAuth, acceptVerification);
router.post("/reject-verification/:id", requireAuth, rejectVerification);
router.post("/remove-verification/:id", requireAuth, removeSpecificVerification);

router.get("/get-certifications", requireAuth, getCertifications);
router.get("/get-certification/:id", requireAuth, getCertification);
router.get("/accept-certification/:id", requireAuth, acceptCertification);
router.get("/reject-certification/:id", requireAuth, rejectCertification);

router.get("/get-clients", getClients);
router.get("/get-client/:id", getClient);
router.get("/activate-client/:id", activateClient);
router.get("/deactivate-client/:id", deactivateClient);

router.get("/get-worker-list", getWorkerList);
router.get("/get-worker/:id", getWorker);
router.get("/activate-worker/:id", activateWorker);
router.get("/deactivate-worker/:id", deactivateWorker);

router.get("/get-transactions", requireAuth, getTransactions);
router.get("/get-transaction/:id", requireAuth, getSpecificTransaction);

router.get("/get-reports", requireAuth, getReports);
router.get("/get-report/:id", requireAuth, getReport);
router.get("/resolve-report/:id", requireAuth, resolveReport);
router.get("/reject-report/:id", requireAuth, rejectReport);

export default router;
