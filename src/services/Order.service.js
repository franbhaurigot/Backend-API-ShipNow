import repo from '../repositories/Order.repository.js';
import userRepo from '../repositories/User.repository.js';
import productRepo from '../repositories/Product.repository.js';
import { HttpError } from '../utils/HttpError.js';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';
import logger from '../config/logger.js';
import { getPagination, buildPagination } from '../utils/pagination.js';

class OrderService {
  async getAll(query) {
    const { page, limit, skip } = getPagination(query);
    const filters = {};
    if (query.status) {
      if (!Object.values(ORDER_STATUS).includes(query.status)) throw new HttpError(400, 'INVALID_ORDER_FILTER', 'status no es válido.');
      filters.status = query.status;
    }
    if (query.priority) {
      if (!Object.values(ORDER_PRIORITY).includes(query.priority)) throw new HttpError(400, 'INVALID_ORDER_FILTER', 'priority no es válida.');
      filters.priority = query.priority;
    }
    if (query.user) filters.user = query.user;
    const [data, total] = await Promise.all([repo.findAll({ skip, limit, filters }), repo.countAll(filters)]);
    return { data, pagination: buildPagination(page, limit, total) };
  }
  async getById(id) { const order = await repo.findById(id); if (!order) throw new HttpError(404, 'ORDER_NOT_FOUND', 'Pedido no encontrado.'); return order; }
  async create(data) {
    if (!data.user || !Array.isArray(data.items) || !data.items.length || !data.destination) throw new HttpError(400, 'INVALID_ORDER', 'user, items (no vacío) y destination son obligatorios.');
    const user = await userRepo.findByIdForRelation(data.user);
    if (!user) throw new HttpError(404, 'USER_NOT_FOUND', 'El usuario asociado al pedido no existe.');
    const items = [];
    let total = 0;
    for (const item of data.items) {
      if (!item.product || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) throw new HttpError(400, 'INVALID_ORDER_ITEM', 'Cada item requiere product y quantity entero mayor a cero.');
      const product = await productRepo.findByIdForOrder(item.product);
      if (!product) throw new HttpError(404, 'PRODUCT_NOT_FOUND', 'Uno de los productos del pedido no existe.');
      if (product.stock < item.quantity) throw new HttpError(400, 'INSUFFICIENT_STOCK', `Stock insuficiente para ${product.name}.`);
      items.push({ product: product._id, quantity: Number(item.quantity), unitPrice: product.price });
      total += product.price * Number(item.quantity);
    }
    if (data.priority && !Object.values(ORDER_PRIORITY).includes(data.priority)) throw new HttpError(400, 'INVALID_PRIORITY', 'Prioridad inválida.');
    const order = await repo.create({ code: `SN-${Date.now()}-${Math.floor(Math.random()*1000)}`, user: user._id, items, total, destination: data.destination, priority: data.priority || ORDER_PRIORITY.NORMAL });
    logger.info(`Pedido ${order.code} creado correctamente`);
    return order;
  }
  async updateStatus(id, status) {
    if (!Object.values(ORDER_STATUS).includes(status)) throw new HttpError(400, 'INVALID_ORDER_STATUS', 'Estado de pedido inválido.');
    const order = await repo.updateStatus(id, status);
    if (!order) throw new HttpError(404, 'ORDER_NOT_FOUND', 'Pedido no encontrado.');
    return order;
  }
}
export default new OrderService();
