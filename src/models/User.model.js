import mongoose from 'mongoose';
import { ROLES, DOCUMENT_TYPES } from '../constants/index.js';

const documentSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, enum: Object.values(DOCUMENT_TYPES), required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, required: true },
  phone: { type: String, default: '' },
  documents: { type: [documentSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
