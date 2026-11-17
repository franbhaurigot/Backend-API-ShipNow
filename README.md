# ShipNow API

API para administrar usuarios, productos, pedidos y entregas. Está desarrollada con Node.js, Express y MongoDB. El proyecto está organizado en rutas, controladores, servicios y repositorios.

## Requisitos

- Node.js 20 o superior
- npm
- MongoDB (si se ejecuta sin Docker)
- Docker Desktop (para usar Docker Compose)

## Ejecutar localmente

Instalá las dependencias y creá tu archivo de configuración:

```bash
npm install
cp .env.example .env
```

En Windows podés copiar el archivo desde el Explorador y renombrarlo a `.env`.

Revisá que `MONGODB_URI` apunte a tu MongoDB. Después iniciá la API:

```bash
npm run dev
```

También está disponible `npm start`, que inicia el servidor sin nodemon.

La API queda en `http://localhost:3000`. El estado se consulta en `/health` y Swagger en `/api/docs` mientras el entorno no sea producción.

## Variables de entorno

| Variable | Uso |
|---|---|
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | Conexión a MongoDB |
| `NODE_ENV` | development, test o production |
| `LOG_LEVEL` | Nivel de detalle de los logs |
| `ENABLE_SWAGGER` | Habilita Swagger en producción si vale true |

La aplicación revisa las variables necesarias al arrancar. Si falta alguna o tiene un valor inválido, muestra el error y no inicia. Los valores de ejemplo están en `.env.example`; las credenciales locales van en `.env`, que no se debe subir al repositorio.

No hay variables de JWT ni de servicios externos porque esta versión todavía no implementa autenticación ni integra servicios de terceros.

## Listados, filtros y paginación

Los listados aceptan filtros por query string. Los filtros se pueden combinar entre sí y con la paginación.

| Recurso | Filtros disponibles |
|---|---|
| Usuarios | `role`, `name`, `email` |
| Productos | `name`, `status`, `availableOnly=true` |
| Pedidos | `status`, `priority`, `user` |
| Entregas | `status`, `courier`, `order` |

Los filtros de texto por nombre y email buscan coincidencias parciales sin distinguir mayúsculas. Los filtros de estado, rol y prioridad aceptan los valores definidos por la API; un valor inválido devuelve HTTP 400.

Los listados de usuarios, pedidos y entregas también aceptan:

- `page`: página a consultar (empieza en 1).
- `limit`: cantidad de resultados (por defecto 10, máximo 100).

Ejemplos:

```http
GET /api/users?role=COURIER&name=norte&page=1&limit=10
GET /api/products?name=cable&availableOnly=true
GET /api/orders?status=CONFIRMED&priority=HIGH&page=1&limit=20
GET /api/deliveries?status=DELIVERED
```

Las respuestas de usuarios, pedidos y entregas incluyen un objeto `pagination` con el total de registros que coinciden con los filtros y las páginas disponibles. Si los valores de paginación no son válidos, la API responde con HTTP 400.

## Archivos

Los documentos de usuarios y los comprobantes de entrega se reciben con Multer. Se permiten PDF, PNG y JPG/JPEG, con un tamaño máximo de 5 MB.

Por defecto, los archivos se guardan fuera de la carpeta del proyecto, en `../shipnow-uploads/`. La ubicación se puede cambiar con `UPLOAD_DIR`. En Docker se usa el volumen `uploads_data`. MongoDB guarda los metadatos del archivo.

Para esta entrega se propone conservar los documentos de usuario hasta 365 días desde la carga y los comprobantes hasta 90 días después de que la entrega figure como entregada. La eliminación debe realizarse mediante una tarea de mantenimiento: todavía no está automatizada. En un entorno real también habría que definir backups y evaluar almacenamiento externo.

## Producción

Con `NODE_ENV=production` no se registran las rutas de mocks ni la ruta de prueba del logger. Swagger también queda deshabilitado, salvo que se configure `ENABLE_SWAGGER=true`.

El endpoint `/health` informa el estado de la API, el entorno, el tiempo activo y la fecha de consulta. No expone credenciales ni la URI de MongoDB.

## Tests

Ejecutá las pruebas con:

```bash
npm test
```

Se usan Mocha, Chai y Supertest. Para la base de datos de pruebas se utiliza mongodb-memory-server; la primera ejecución puede descargar el binario de MongoDB.

## Docker

Con Docker Desktop abierto y el archivo `.env` creado, ejecutá:

```bash
docker compose up --build -d
```

Docker Compose inicia la API y MongoDB. La API queda disponible en el puerto 3000 (o en el puerto definido en `PORT`).

Para comprobar que está respondiendo:

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/api/users?page=1&limit=10"
```

Para ver los logs:

```bash
docker compose logs -f api
```

Para detener los servicios:

```bash
docker compose down
```

MongoDB, los archivos subidos y los logs se guardan en volúmenes. Por eso `docker compose down` no borra esos datos. Si también querés eliminar los volúmenes, usá `docker compose down -v`.

También se puede construir y ejecutar solo la imagen de la API:

```bash
docker build -t shipnow-api .
docker run --rm -p 3000:3000 --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/shipnow shipnow-api
```

Para esta entrega conviene usar Docker Compose, porque también configura MongoDB.

## Archivos que quedan fuera de Git

El repositorio ignora `.env`, `node_modules/`, `logs/`, `uploads/` y `coverage/`. Docker aplica exclusiones similares mediante `.dockerignore`.

## Organización del proyecto

- `src/config`: configuración, Swagger, Multer y logging.
- `src/controllers`: manejo de las solicitudes HTTP.
- `src/services`: lógica de la aplicación.
- `src/repositories`: consultas a MongoDB.
- `src/models`: modelos de Mongoose.
- `src/routes`: definición de endpoints.
- `src/middlewares`: manejo de errores y rutas inexistentes.
- `src/utils`: funciones auxiliares.
- `tests`: pruebas.

## Alcance

Esta versión no tiene autenticación ni autorización, por lo que no debería usarse con información sensible o datos reales. Antes de llevarla a un entorno real habría que agregar esas funciones, proteger las contraseñas, verificar el contenido real de los archivos y automatizar la política de retención.
