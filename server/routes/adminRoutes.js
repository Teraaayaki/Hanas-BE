import express from "express";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  countPendingVerifications,
  countUsers,
  countPendingReports,
  countIncome,
  percentageOfVerified,
  percentageOnTypeOfUsers,
} from "../controllers/AdminControllers/overviewController.js";
import {
  getVerifications,
  getSpecificVerification,
  acceptVerification,
  rejectVerification,
  removeSpecificVerification,
  sortVerification,
  filterVerification,
} from "../controllers/AdminControllers/verificationController.js";

import {
  getCertificationList,
  getCertification,
  acceptCertification,
  rejectCertification,
  reopenCertification,
} from "../controllers/AdminControllers/certificationController.js";

import {
  getClientList,
  getClient,
  activateClient,
  deactivateClient,
  sortClient,
  filterClient,
} from "../controllers/AdminControllers/clientController.js";

import {
  getWorkerList,
  getWorker,
  activateWorker,
  deactivateWorker,
  sortWorker,
  filterWorker,
} from "../controllers/AdminControllers/workerController.js";

import {
  getTransactions,
  getSpecificTransaction,
  sortTransaction,
} from "../controllers/AdminControllers/transactionController.js";

import {
  getReportList,
  getReport,
  resolveReport,
  rejectReport,
  reopenReport,
  sortReport,
  filterReport,
} from "../controllers/AdminControllers/reportController.js";

import { addToAchievement } from "../controllers/AdminControllers/achievementController.js";

import { getConvFeeTransactions, setToPaid, sortConvFee, filterConvFee, checkForOverdue} from "../controllers/AdminControllers/convFeeTransactionController.js";

import { getAllWorkerList } from "../controllers/AdminControllers/achievementController.js";

router.get("/count-verifications", countPendingVerifications);
router.get("/count-users", countUsers);
router.get("/count-reports", countPendingReports);
router.get("/get-verified", percentageOfVerified);
router.get("/get-type-of-users", percentageOnTypeOfUsers);
router.get("/get-income", countIncome);

/*VERIFICATIONS*/
router.get("/get-verifications", getVerifications);
router.get("/get-verification/:id", getSpecificVerification);
router.post("/accept-verification/:id", acceptVerification);
router.post("/reject-verification/:id", rejectVerification);
router.post("/remove-verification/:id", removeSpecificVerification);
router.patch("/sort-verification", sortVerification);
router.patch("/filter-verification", filterVerification);

/*CERTIFICATION*/
router.get("/get-certification-list", getCertificationList);
router.get("/get-certification/:id", getCertification);
router.get("/accept-certification/:id", acceptCertification);
router.get("/reject-certification/:id", rejectCertification);
router.get("/reopen-certification/:id", reopenCertification);

/*CLIENT*/
router.get("/get-client-list", getClientList);
router.get("/get-client/:id", getClient);
router.get("/activate-client/:id", activateClient);
router.get("/deactivate-client/:id", deactivateClient);
router.patch("/sort-client", sortClient);
router.patch("/filter-client", filterClient);

/*WORKER*/
router.get("/get-worker-list", getWorkerList);
router.get("/get-worker/:id", getWorker);
router.get("/activate-worker/:id", activateWorker);
router.get("/deactivate-worker/:id", deactivateWorker);
router.patch("/sort-worker", sortWorker);
router.patch("/filter-worker", filterWorker);

/*TRANSACTIONS*/
router.get("/get-transactions", getTransactions);
router.get("/get-transaction/:id", getSpecificTransaction);
router.patch("/sort-transaction", sortTransaction);

/*REPORTS*/
router.get("/get-report-list", getReportList);
router.get("/get-report/:id", getReport);
router.get("/get-type-of-users", percentageOnTypeOfUsers);
router.get("/resolve-report/:id", resolveReport);
router.get("/reject-report/:id", rejectReport);
router.get("/reopen-report/:id", reopenReport);
router.patch("/filter-report", filterReport);
router.patch("/sort-report", sortReport);

/*ACHIEVEMENTS*/
router.patch("/add-to-achievement", addToAchievement);
router.get("/get-all-workers", getAllWorkerList);

/*CONVENIENCE FEE*/
router.get("/get-conv-fee-list", getConvFeeTransactions);
router.patch("/set-to-paid", setToPaid);
router.patch("/sort-convenience-fee", sortConvFee);
router.patch("/filter-convenience-fee", filterConvFee);
router.patch("/reset-conv-fee", checkForOverdue);



export default router;
