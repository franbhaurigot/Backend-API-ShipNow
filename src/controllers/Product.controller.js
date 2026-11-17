import service from '../services/Product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getProducts = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getAll(req.query) }));
export const getProduct = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getById(req.params.id) }));
export const createProduct = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.create(req.body) }));
