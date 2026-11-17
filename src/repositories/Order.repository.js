import Order from '../models/Order.model.js';

class OrderRepository {
  findAll({ skip, limit, filters = {} }) { return Order.find(filters).populate('user', 'name email role').populate('items.product').sort({ createdAt: -1 }).skip(skip).limit(limit); }
  countAll(filters = {}) { return Order.countDocuments(filters); }
  findById(id) { return Order.findById(id).populate('user', 'name email role').populate('items.product'); }
  findRawById(id) { return Order.findById(id); }
  create(data) { return Order.create(data); }
  updateStatus(id, status) { return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }); }
  insertMany(data) { return Order.insertMany(data); }
  deleteAll() { return Order.deleteMany({}); }
}
export default new OrderRepository();
