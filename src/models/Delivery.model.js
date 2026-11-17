import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../constants/index.js';

const proofSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  mimeType: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.PENDING },
  proof: { type: proofSchema, default: null }
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);
