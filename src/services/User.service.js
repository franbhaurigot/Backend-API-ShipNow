import repo from '../repositories/User.repository.js';
import { HttpError } from '../utils/HttpError.js';
import { ROLES, DOCUMENT_TYPES } from '../constants/index.js';
import { getPagination, buildPagination } from '../utils/pagination.js';

class UserService {
  async getAll(query) {
    const { page, limit, skip } = getPagination(query);
    const filters = {};
    if (query.role) {
      if (!Object.values(ROLES).includes(query.role)) throw new HttpError(400, 'INVALID_USER_FILTER', 'role no es válido.');
      filters.role = query.role;
    }
    if (query.name) filters.name = { $regex: escapeRegex(query.name), $options: 'i' };
    if (query.email) filters.email = { $regex: escapeRegex(query.email), $options: 'i' };
    const [data, total] = await Promise.all([repo.findAll({ skip, limit, filters }), repo.countAll(filters)]);
    return { data, pagination: buildPagination(page, limit, total) };
  }
  async getById(id) { const user = await repo.findById(id); if (!user) throw new HttpError(404, 'USER_NOT_FOUND', 'Usuario no encontrado.'); return user; }
  async create(data) {
    if (!data.name || !data.email || !data.password) throw new HttpError(400, 'INVALID_USER', 'name, email y password son obligatorios.');
    if (data.role && !Object.values(ROLES).includes(data.role)) throw new HttpError(400, 'INVALID_ROLE', 'El rol indicado no es válido.');
    if (await repo.findByEmail(data.email)) throw new HttpError(409, 'EMAIL_EXISTS', 'Ya existe un usuario con ese email.');
    return repo.create(data);
  }
  async addDocument(id, file, documentType) {
    if (!file) throw new HttpError(400, 'FILE_REQUIRED', 'Debés adjuntar un archivo en el campo file.');
    if (!Object.values(DOCUMENT_TYPES).includes(documentType)) throw new HttpError(400, 'INVALID_DOCUMENT_TYPE', 'Tipo de documento inválido.');
    await this.getById(id);
    const metadata = { originalName: file.originalname, filename: file.filename, path: file.path, mimeType: file.mimetype, size: file.size, documentType };
    return repo.addDocument(id, metadata);
  }
}
function escapeRegex(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export default new UserService();
