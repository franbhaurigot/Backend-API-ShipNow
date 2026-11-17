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
const validEnvironments = ['development', 'test', 'production'];
if (!validEnvironments.includes(process.env.NODE_ENV)) {
  throw new Error('Configuración inválida: NODE_ENV debe ser development, test o production.');
}
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const validLogLevels = ['fatal', 'error', 'warning', 'info', 'http', 'debug'];
if (!validLogLevels.includes(logLevel)) {
  throw new Error(`Configuración inválida: LOG_LEVEL debe ser uno de: ${validLogLevels.join(', ')}.`);
}

export const config = Object.freeze({
  port,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  logLevel,
  enableSwagger: process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production'
});
