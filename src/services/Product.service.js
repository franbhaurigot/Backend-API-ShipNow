import repo from '../repositories/Product.repository.js';
import { HttpError } from '../utils/HttpError.js';

class ProductService {
  getAll({ availableOnly = false } = {}) { return availableOnly ? repo.findAvailable() : repo.findAll(); }
  async getById(id) { const product = await repo.findById(id); if (!product) throw new HttpError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.'); return product; }
  create(data) {
    if (!data.name || data.price === undefined || data.stock === undefined) throw new HttpError(400, 'INVALID_PRODUCT', 'name, price y stock son obligatorios.');
    if (Number(data.price) < 0 || Number(data.stock) < 0) throw new HttpError(400, 'INVALID_PRODUCT', 'price y stock no pueden ser negativos.');
    return repo.create(data);
  }
}
export default new ProductService();
