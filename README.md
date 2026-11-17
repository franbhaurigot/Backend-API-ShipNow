# ShipNow API — Proyecto integrador (Módulos 1 a 7)

API REST de gestión logística desarrollada con Node.js, Express y MongoDB. Integra arquitectura por capas, mocking, manejo centralizado de errores, logging con Winston, documentación Swagger, testing funcional y carga de documentos/comprobantes.

## Requisitos

- Node.js 20 o superior
- npm
- MongoDB local o una instancia MongoDB Atlas

## Instalación y ejecución

```bash
npm install
cp .env.example .env
```

Editar `.env` con los valores de tu entorno:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
LOG_LEVEL=debug
```

Iniciar:

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`. Health check: `GET /health`.

## Arquitectura

```text
src/
  config/         configuración de entorno, Winston, Swagger y Multer
  constants/      roles, estados, prioridades y tipos de documentos
  controllers/    entrada HTTP; reciben req/res y delegan
  middlewares/    404 y manejo global de errores
  models/         esquemas Mongoose
  repositories/   acceso y consultas a MongoDB
  routes/         asociación de paths con controllers
  services/       reglas de negocio y validaciones
  utils/          errores, códigos y asyncHandler
  app.js          configuración Express exportable
  server.js       conexión MongoDB y levantamiento del servidor
tests/            pruebas funcionales
```

Los controllers no acceden a Mongoose. Los services aplican reglas de negocio (validaciones, cálculo de totales y relaciones); los repositories encapsulan consultas, filtros, proyecciones y persistencia. `app.js` se puede importar sin abrir un puerto, lo que permite probar la API con Supertest.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/:id` | Consultar usuario |
| POST | `/api/users/:id/documents` | Subir documento (`multipart/form-data`, campo `file`, campo `documentType`) |
| GET | `/api/products` | Listar productos (`?availableOnly=true` filtra stock) |
| POST | `/api/products` | Crear producto |
| GET | `/api/products/:id` | Consultar producto |
| GET | `/api/orders` | Listar pedidos |
| POST | `/api/orders` | Crear pedido; calcula el total con los precios actuales |
| GET | `/api/orders/:id` | Consultar pedido |
| PATCH | `/api/orders/:id/status` | Actualizar estado (`status`) |
| GET | `/api/deliveries` | Listar entregas |
| POST | `/api/deliveries` | Crear entrega asociada a pedido y repartidor opcional |
| GET | `/api/deliveries/:id` | Consultar entrega |
| POST | `/api/deliveries/:id/proof` | Subir comprobante (`multipart/form-data`, campo `file`) |
| GET | `/api/mocks/users?qty=2` | Generar usuarios simulados en memoria |
| GET | `/api/mocks/orders?qty=2` | Generar pedidos de muestra sin persistir |
| GET | `/api/mocks/deliveries?qty=2` | Generar entregas de muestra sin persistir |
| POST | `/api/mocks/seed` | Insertar datos relacionados en MongoDB; body `{ "qty": 2 }` |
| GET | `/api/logger/test` | Diagnóstico: emite todos los niveles de log |
| GET | `/api/docs` | Swagger UI |

Los endpoints de mocks aceptan `qty` entero entre 1 y 100. El seed genera usuarios, repartidores, productos, pedidos y entregas relacionados. `insertados` representa el total de documentos creados entre colecciones.

## Manejo de errores

Todas las respuestas de error usan el formato:

```json
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Pedido no encontrado."
  }
}
```

Los errores se originan en la capa correspondiente y el middleware global normaliza la respuesta HTTP. Entre otros: `VALIDATION_ERROR`, `USER_NOT_FOUND`, `ORDER_NOT_FOUND`, `INVALID_ORDER_STATUS`, `INVALID_MOCK_QUANTITY`, `FILE_REQUIRED`, `INVALID_FILE_TYPE` e `INTERNAL_SERVER_ERROR`.

## Logging

Se utiliza Winston con niveles `debug`, `http`, `info`, `warning`, `error` y `fatal`. En desarrollo la consola muestra nivel debug; en producción muestra desde info. Se generan archivos diarios en `logs/`, con rotación por fecha, tamaño máximo y retención. `error-*.log` guarda errores y niveles más graves. La carpeta `logs/` está excluida de Git.

Probar con `GET /api/logger/test`. El endpoint es una herramienta de diagnóstico y no una funcionalidad de negocio.

## Carga de archivos

Multer acepta PDF, PNG y JPG/JPEG con un máximo de 5 MB. Los documentos se guardan bajo `uploads/user-documents/` y los comprobantes bajo `uploads/delivery-proofs/`. MongoDB almacena únicamente metadatos (nombre original, nombre generado, ruta, MIME, tamaño y fecha). `uploads/` está excluida de Git.

Para documentos de usuario, enviar `POST /api/users/:id/documents` como `multipart/form-data` con:
- `file`: archivo
- `documentType`: `ID`, `ADDRESS_PROOF` u `OTHER`

Para comprobantes, enviar `POST /api/deliveries/:id/proof` con `file`.

## Testing

Herramientas: Mocha, Chai y Supertest. Los tests usan `mongodb-memory-server`, por lo que no necesitan conectarse a tu base de desarrollo. La primera ejecución puede descargar el binario de MongoDB si todavía no está disponible localmente.

```bash
npm test
```

La suite crea y limpia sus propios datos antes de cada caso. Cubre usuarios, productos, pedidos, estados inválidos, mocks, seed, logger, Swagger, entregas y rutas inexistentes.

## Seguridad y repositorio

- No subir `.env`, `node_modules/`, `logs/` ni `uploads/`.
- No usar datos reales en los tests.
- Para producción, agregar autenticación/autorización, hash de contraseñas, rate limiting y almacenamiento de archivos externo (por ejemplo, S3). Este proyecto es una base académica y no implementa autenticación.
