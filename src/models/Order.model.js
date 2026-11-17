import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [itemSchema], required: true, validate: v => v.length > 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
  priority: { type: String, enum: Object.values(ORDER_PRIORITY), default: ORDER_PRIORITY.NORMAL },
  destination: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
