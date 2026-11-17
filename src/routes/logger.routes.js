import { Router } from 'express';
import { testLogger } from '../controllers/Logger.controller.js';
const router = Router();
router.get('/test', testLogger);
export default router;
