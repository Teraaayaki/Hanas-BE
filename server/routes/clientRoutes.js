import express from 'express';
import { validate } from '../middleware/validations.js';

const router = express.Router();

import {
  loginClient,
  registerClient,
  logoutClient
} from '../controllers/ClientControllers/authController.js';

//AUTH ROUTES
router.post('/login', validate('loginClient'), loginClient);
router.post('/register', registerClient);
router.delete('/logout', logoutClient);

export default router;
