import { config } from './config/index.js';
import mongoose from 'mongoose';
import app from './app.js';
import logger from './config/logger.js';

try {
  await mongoose.connect(config.mongoUri);
  logger.info('Conexión a MongoDB establecida');
  app.listen(config.port, () => logger.info(`Servidor ShipNow escuchando en el puerto ${config.port}`));
} catch (error) {
  logger.log('fatal', `No se pudo iniciar ShipNow: ${error.message}`);
  process.exit(1);
}
