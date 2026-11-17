import service from '../services/Order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getOrders = asyncHandler(async (req, res) => res.json({ success: true, ...await service.getAll(req.query) }));
export const getOrder = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getById(req.params.id) }));
export const createOrder = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.create(req.body) }));
export const updateOrderStatus = asyncHandler(async (req, res) => res.json({ success: true, data: await service.updateStatus(req.params.id, req.body.status) }));
