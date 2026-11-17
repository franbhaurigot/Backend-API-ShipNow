import multer from 'multer';
import logger from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';

export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err);

  let error = err;
  if (err.message === 'Tipo de archivo no permitido. Solo PDF, PNG y JPG.') {
    error = new HttpError(400, 'INVALID_FILE_TYPE', err.message);
  }

  if (err instanceof multer.MulterError) {
    const isSize = err.code === 'LIMIT_FILE_SIZE';
    error = new HttpError(isSize ? 413 : 400, isSize ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR',
      isSize ? 'El archivo supera el tamaño máximo permitido (5 MB).' : 'Error al recibir el archivo.');
  }

  const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
  const code = error.code || (status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');
  const message = status >= 500 ? 'Ocurrió un error interno del servidor.' : error.message;

  if (status >= 500) logger.error(`${req.method} ${req.originalUrl}: ${err.stack || err.message}`);
  else logger.warning(`${req.method} ${req.originalUrl}: ${message}`);

  res.status(status).json({
    success: false,
    error: { code, message, ...(error.details ? { details: error.details } : {}) }
  });
}
