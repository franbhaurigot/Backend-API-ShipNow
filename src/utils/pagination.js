import { HttpError } from './HttpError.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function getPagination(query = {}) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, 'INVALID_PAGINATION', 'page debe ser un entero mayor o igual a 1.');
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new HttpError(400, 'INVALID_PAGINATION', `limit debe ser un entero entre 1 y ${MAX_LIMIT}.`);
  }

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPagination(page, limit, totalItems) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1 && totalPages > 0
  };
}
