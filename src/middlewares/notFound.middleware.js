import { HttpError } from '../utils/HttpError.js';
export function notFoundMiddleware(req, res, next) {
  next(new HttpError(404, 'ROUTE_NOT_FOUND', `No existe la ruta ${req.method} ${req.originalUrl}.`));
}
