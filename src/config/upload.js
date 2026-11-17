import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];
const maxFileSize = 5 * 1024 * 1024;

export function createUpload(destination) {
  const absoluteDestination = path.resolve('uploads', destination);
  fs.mkdirSync(absoluteDestination, { recursive: true });
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, absoluteDestination),
    filename: (_req, file, cb) => {
      const safeExtension = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
    }
  });
  return multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) return cb(new Error('Tipo de archivo no permitido. Solo PDF, PNG y JPG.'));
      cb(null, true);
    }
  });
}
