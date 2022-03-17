import express from "express";
import { validate, validationErrors } from "../middleware/validations.js";
const router = express.Router();

import {
  loginClient,
  registerClient,
  logoutClient,
} from "../controllers/ClientControllers/authController.js";

//AUTH ROUTES
router.post("/login", validate("login"), validationErrors, loginClient);
router.post(
  "/register",
  validate("register"),
  validationErrors,
  registerClient
);
router.delete("/logout", logoutClient);

export default router;
