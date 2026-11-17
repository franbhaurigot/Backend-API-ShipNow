import { Router } from 'express';
import { getOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/Order.controller.js';
const router = Router();
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
export default router;
