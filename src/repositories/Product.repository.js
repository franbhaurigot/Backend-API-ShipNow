import Product from '../models/Product.model.js';

class ProductRepository {
  findAvailable() { return Product.find({ stock: { $gt: 0 } }).sort({ name: 1 }); }
  findAll() { return Product.find().sort({ createdAt: -1 }); }
  findById(id) { return Product.findById(id); }
  findByIdForOrder(id) { return Product.findById(id); }
  create(data) { return Product.create(data); }
  insertMany(data) { return Product.insertMany(data); }
  deleteAll() { return Product.deleteMany({}); }
}
export default new ProductRepository();
