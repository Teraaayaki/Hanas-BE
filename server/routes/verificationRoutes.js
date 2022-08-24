import express from "express";
import { validate, validationErrors } from "../middleware/validations.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

import {
  loginClient,
  verifyNumberClient,
  registerClient,
  logoutClient,
  verifyNumberOtpClient,
  resendCodeClient,
  getDetails,
  loginAdmin,
  editPassword,
  forgotPassEmail,
  forgotPassOtp,
  forgotPassChange,
} from "../controllers/authController.js";

//AUTH ROUTES
router.get("/get-details", requireAuth, getDetails);
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
  "/resend-code",
  validate("number"),
  validationErrors,
  resendCodeClient
);
router.post(
  "/verify-number-otp",
  validate("otp-number"),
  validationErrors,
  verifyNumberOtpClient
);
router.delete("/logout", logoutClient);

router.post("/edit-password", validationErrors, editPassword);
router.post(
  "/forgot-pass-email",
  validate("forgot-pass-email"),
  validationErrors,
  forgotPassEmail
);
router.post(
  "/forgot-pass-otp",
  validate("forgot-pass-otp"),
  validationErrors,
  forgotPassOtp
);
router.post(
  "/forgot-pass-change",
  validate("forgot-pass-change"),
  validationErrors,
  forgotPassChange
);

//ADMIN AUTH ROUTES
router.post("/admin-login", validate("login"), validationErrors, loginAdmin);

export default router;
