import dotenv from 'dotenv';

dotenv.config();

const required = ['PORT', 'MONGODB_URI', 'NODE_ENV'];
const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length) {
  throw new Error(`Configuración incompleta: faltan variables obligatorias: ${missing.join(', ')}. Revisá tu archivo .env.`);
}

const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error('Configuración inválida: PORT debe ser un número entero entre 1 y 65535.');
}

export const config = Object.freeze({
  port,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
});
