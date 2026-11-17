# ShipNow API — Proyecto integrador (Módulos 1 a 8)

API REST de gestión logística desarrollada con Node.js 20+, Express y MongoDB. Incluye arquitectura por capas, validaciones, paginación, carga controlada de archivos, logging, Swagger, pruebas funcionales y despliegue con Docker.

## Requisitos

- Node.js 20 o superior y npm
- MongoDB local/Atlas (para ejecución local)
- Docker y Docker Compose (para contenedores)

## Configuración local

```bash
npm install
cp .env.example .env
```

Configurar las variables en `.env`:

| Variable | Uso | Ejemplo |
|---|---|---|
| PORT | Puerto HTTP | 3000 |
| MONGODB_URI | Conexión MongoDB | mongodb://127.0.0.1:27017/shipnow |
| NODE_ENV | Entorno (development, test, production) | development |
| LOG_LEVEL | Nivel mínimo de consola | debug |
| ENABLE_SWAGGER | Habilitar Swagger explícitamente en producción | false |

No guardar secretos ni credenciales reales en `.env.example`. La aplicación valida las variables obligatorias y sus valores al iniciar. No utiliza JWT ni URLs de servicios externos porque este proyecto todavía no integra autenticación ni servicios de terceros.

Iniciar en desarrollo:

```bash
npm run dev
```

O iniciar normalmente:

```bash
npm start
```

API: http://localhost:3000  
Health check: http://localhost:3000/health  
Swagger: http://localhost:3000/api/docs (habilitado automáticamente fuera de producción).

## Paginación

Los listados de usuarios, pedidos y entregas están paginados. Parámetros:
- `page`: página desde 1 (predeterminado: 1).
- `limit`: elementos por página (predeterminado: 10; máximo: 100).

Ejemplo: `GET /api/orders?page=2&limit=20`.

La respuesta incluye `data` y `pagination` con página, límite, total, páginas y banderas de navegación. Valores inválidos devuelven HTTP 400.

## Carga de archivos

Multer acepta PDF, PNG y JPG/JPEG con máximo de 5 MB y extensión coherente con el MIME declarado. Los archivos se guardan en `uploads/`; MongoDB almacena metadatos. Los errores de tipo y tamaño se devuelven de forma controlada.

La carpeta de archivos no forma parte del repositorio. En Docker se monta en un volumen separado. Para un entorno real, definir retención y eliminación periódica de archivos, backups y/o migrar a almacenamiento de objetos (S3 u otro). El volumen no reemplaza una política de retención.

## Entornos y endpoints internos

- `development`: Swagger, mocks y endpoint de diagnóstico del logger habilitados.
- `test`: Swagger, mocks y diagnóstico habilitados para pruebas.
- `production`: mocks y diagnóstico del logger deshabilitados. Swagger también queda deshabilitado por defecto; puede habilitarse con `ENABLE_SWAGGER=true` si el despliegue lo requiere.

El health check informa estado, entorno, uptime y timestamp, sin exponer URI de base de datos ni secretos.

## Testing

Los tests usan Mocha, Chai, Supertest y mongodb-memory-server:

```bash
npm test
```

La primera ejecución puede descargar el binario de MongoDB para pruebas.

## Docker

Crear una copia local de las variables:

```bash
cp .env.example .env
```

Levantar API y MongoDB:

```bash
docker compose up --build -d
```

La API queda en http://localhost:3000. Verificar:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/users?page=1&limit=10
```

Swagger está deshabilitado en el contenedor por defecto. Para habilitarlo, definir `ENABLE_SWAGGER=true` en el archivo `.env` y recrear el servicio:

```bash
docker compose up -d --force-recreate
```

Ver logs y detener:

```bash
docker compose logs -f api
docker compose down
```

Docker Compose crea volúmenes para MongoDB, archivos subidos y logs. `docker compose down` conserva los volúmenes; `docker compose down -v` los elimina junto con los datos.

Para construir la imagen manualmente:

```bash
docker build -t shipnow-api .
docker run --rm -p 3000:3000 --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/shipnow shipnow-api
```

En Linux, para conectar ese contenedor a MongoDB del host, configurar una red/host gateway apropiada; la opción recomendada para esta entrega es Docker Compose.

## Archivos excluidos del repositorio

`.env`, `node_modules/`, `.git/`, `logs/`, `uploads/`, `coverage/` y archivos temporales. `.dockerignore` aplica exclusiones equivalentes al contexto de construcción.

## Arquitectura

```text
src/
  config/         entorno, Winston, Swagger y Multer
  constants/      roles, estados y tipos de documentos
  controllers/    entrada HTTP
  middlewares/    404 y errores globales
  models/         esquemas Mongoose
  repositories/   consultas y persistencia
  routes/         rutas Express
  services/       reglas de negocio
  utils/          errores, asyncHandler y paginación
  app.js          configuración Express
  server.js       conexión MongoDB y servidor
tests/            pruebas funcionales
```

## Seguridad y alcance

No se implementa autenticación ni autorización. Antes de usar con datos reales, agregar autenticación, hash de contraseñas, rate limiting, validación de contenido real de archivos, almacenamiento externo y políticas de retención. No subir `.env`, datos personales, archivos cargados ni logs al repositorio.
