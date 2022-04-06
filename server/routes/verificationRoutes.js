import express from 'express';
import { validate, validationErrors } from '../middleware/validations.js';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

import {
  loginClient,
  verifyNumberClient,
  registerClient,
  logoutClient,
  verifyNumberOtpClient,
  getDetails,
  loginAdmin
} from '../controllers/authController.js';

//AUTH ROUTES
router.get('/get-details', requireAuth, getDetails);
router.post('/login', validate('login'), validationErrors, loginClient);
router.post(
  '/register',
  validate('register'),
  validationErrors,
  registerClient
);
router.post(
  '/verify-number',
  validate('number'),
  validationErrors,
  verifyNumberClient
);
router.post(
  '/verify-number-otp',
  validate('otp-number'),
  validationErrors,
  verifyNumberOtpClient
);
router.delete('/logout', logoutClient);

//ADMIN AUTH ROUTES
router.post('/admin-login', validate('login'), validationErrors, loginAdmin);

export default router;
