import repo from '../repositories/Delivery.repository.js';
import { HttpError } from '../utils/HttpError.js';
import { ROLES, DELIVERY_STATUS } from '../constants/index.js';
import { getPagination, buildPagination } from '../utils/pagination.js';

class DeliveryService {
  async getAll(query) {
    const { page, limit, skip } = getPagination(query);
    const filters = {};
    if (query.status) {
      if (!Object.values(DELIVERY_STATUS).includes(query.status)) throw new HttpError(400, 'INVALID_DELIVERY_FILTER', 'status no es válido.');
      filters.status = query.status;
    }
    if (query.courier) filters.courier = query.courier;
    if (query.order) filters.order = query.order;
    const [data, total] = await Promise.all([repo.findAll({ skip, limit, filters }), repo.countAll(filters)]);
    return { data, pagination: buildPagination(page, limit, total) };
  }
  async getById(id) { const delivery = await repo.findById(id); if (!delivery) throw new HttpError(404, 'DELIVERY_NOT_FOUND', 'Entrega no encontrada.'); return delivery; }
  async create(data) {
    if (!data.order) throw new HttpError(400, 'INVALID_DELIVERY', 'order es obligatorio.');
    if (!await repo.findOrderById(data.order)) throw new HttpError(404, 'ORDER_NOT_FOUND', 'El pedido asociado no existe.');
    if (data.courier) {
      const courier = await repo.findCourierById(data.courier);
      if (!courier || courier.role !== ROLES.COURIER) throw new HttpError(400, 'INVALID_COURIER', 'El repartidor debe existir y tener rol COURIER.');
    }
    return repo.create({ order: data.order, courier: data.courier || null, status: data.courier ? DELIVERY_STATUS.ASSIGNED : DELIVERY_STATUS.PENDING });
  }
  async addProof(id, file) {
    if (!file) throw new HttpError(400, 'FILE_REQUIRED', 'Debés adjuntar un archivo en el campo file.');
    await this.getById(id);
    return repo.addProof(id, { originalName: file.originalname, filename: file.filename, path: file.path, mimeType: file.mimetype, size: file.size });
  }
}
export default new DeliveryService();
