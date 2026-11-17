import service from '../services/User.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getUsers = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getAll() }));
export const getUser = asyncHandler(async (req, res) => res.json({ success: true, data: await service.getById(req.params.id) }));
export const createUser = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.create(req.body) }));
export const uploadUserDocument = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.addDocument(req.params.id, req.file, req.body.documentType) }));
