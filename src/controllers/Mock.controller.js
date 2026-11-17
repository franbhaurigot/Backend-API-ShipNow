import service from '../services/Mock.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const mockUsers = asyncHandler(async (req, res) => res.json({ success: true, data: service.users(req.query.qty) }));
export const mockOrders = asyncHandler(async (req, res) => res.json({ success: true, data: service.orders(req.query.qty) }));
export const mockDeliveries = asyncHandler(async (req, res) => res.json({ success: true, data: service.deliveries(req.query.qty) }));
export const seed = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.seed(req.body.qty ?? req.query.qty) }));
