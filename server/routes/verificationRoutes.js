import express from "express";
import { validate, validationErrors } from "../middleware/validations.js";
const router = express.Router();

import {
  loginClient,
  verifyNumberClient,
  registerClient,
  logoutClient,
  verifyNumberOtpClient,
} from "../controllers/authController.js";

//AUTH ROUTES
router.post("/login", validate("login"), validationErrors, loginClient);
router.post(
  "/register",
  validate("register"),
  validationErrors,
  registerClient
);
router.post(
  "/verify-number",
  validate("number"),
  validationErrors,
  verifyNumberClient
);
router.post(
  "/verify-number-otp",
  validate("otp-number"),
  validationErrors,
  verifyNumberOtpClient
);
router.delete("/logout", logoutClient);

export default router;
