import logger from '../config/logger.js';
export function testLogger(req, res) {
  logger.debug('Prueba de nivel debug');
  logger.http('Prueba de nivel http');
  logger.info('Prueba de nivel info');
  logger.warning('Prueba de nivel warning');
  logger.error('Prueba de nivel error');
  logger.log('fatal', 'Prueba de nivel fatal');
  res.json({ success: true, message: 'Se emitieron registros en todos los niveles del logger.' });
}
