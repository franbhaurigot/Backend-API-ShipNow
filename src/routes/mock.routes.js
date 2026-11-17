import { Router } from 'express';
import { mockUsers, mockOrders, mockDeliveries, seed } from '../controllers/Mock.controller.js';
const router = Router();
router.get('/users', mockUsers);
router.get('/orders', mockOrders);
router.get('/deliveries', mockDeliveries);
router.post('/seed', seed);
export default router;
