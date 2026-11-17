import mongoose from 'mongoose';
import Delivery from '../models/Delivery.model.js';

class DeliveryRepository {
  findAll() { return Delivery.find().populate('order').populate('courier', 'name email role').sort({ createdAt: -1 }); }
  findById(id) { return Delivery.findById(id).populate('order').populate('courier', 'name email role'); }
  findOrderById(id) { return mongoose.model('Order').findById(id); }
  findCourierById(id) { return mongoose.model('User').findById(id); }
  create(data) { return Delivery.create(data); }
  addProof(id, metadata) { return Delivery.findByIdAndUpdate(id, { proof: metadata }, { new: true }).populate('order'); }
  insertMany(data) { return Delivery.insertMany(data); }
  deleteAll() { return Delivery.deleteMany({}); }
}
export default new DeliveryRepository();
