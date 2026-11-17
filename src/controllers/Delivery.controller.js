import service from '../services/Delivery.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getDeliveries = asyncHandler(async (req, res) => res.json({ success: true, ...await service.getAll(req.query) }));
export const getDelivery = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getById(req.params.id) }));
export const createDelivery = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.create(req.body) }));
export const uploadDeliveryProof = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.addProof(req.params.id, req.file) }));
