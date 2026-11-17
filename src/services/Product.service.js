import repo from '../repositories/Product.repository.js';
import { HttpError } from '../utils/HttpError.js';
import { PRODUCT_STATUS } from '../constants/index.js';

class ProductService {
  getAll(query = {}) {
    const filters = {};
    if (query.availableOnly === 'true') filters.stock = { $gt: 0 };
    if (query.status) {
      if (!Object.values(PRODUCT_STATUS).includes(query.status)) throw new HttpError(400, 'INVALID_PRODUCT_FILTER', 'status no es válido.');
      filters.status = query.status;
    }
    if (query.name) filters.name = { $regex: escapeRegex(query.name), $options: 'i' };
    return repo.findAll(filters);
  }
  async getById(id) { const product = await repo.findById(id); if (!product) throw new HttpError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.'); return product; }
  create(data) {
    if (!data.name || data.price === undefined || data.stock === undefined) throw new HttpError(400, 'INVALID_PRODUCT', 'name, price y stock son obligatorios.');
    if (Number(data.price) < 0 || Number(data.stock) < 0) throw new HttpError(400, 'INVALID_PRODUCT', 'price y stock no pueden ser negativos.');
    return repo.create(data);
  }
}
function escapeRegex(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export default new ProductService();
