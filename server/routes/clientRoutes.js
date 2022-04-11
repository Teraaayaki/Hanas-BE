import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
const router = express.Router();

import { getTopRatedWorkers } from '../controllers/ClientControllers/serviceController.js';

router.get("/get-top-rated-workers", requireAuth, getTopRatedWorkers);


export default router;