import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API de gestión de usuarios, productos, pedidos, entregas, mocks, archivos y logging.'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [
      { name: 'Users' }, { name: 'Products' }, { name: 'Orders' },
      { name: 'Deliveries' }, { name: 'Mocks' }, { name: 'Logger' }
    ],
    paths: {
      '/health': { get: { summary: 'Estado del servicio', responses: { '200': { description: 'Servicio disponible' } } } },
      '/api/users': {
        get: { tags: ['Users'], summary: 'Listar usuarios', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }], responses: { '200': { description: 'Listado de usuarios' } } },
        post: { tags: ['Users'], summary: 'Crear usuario', requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/User' } } } }, responses: { '201': { description: 'Usuario creado' }, '400': { description: 'Datos inválidos' } } }
      },
      '/api/users/{id}': { get: { tags: ['Users'], summary: 'Consultar usuario', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Usuario' }, '404': { description: 'No encontrado' } } } },
      '/api/users/{id}/documents': { post: { tags: ['Users'], summary: 'Subir documento de usuario', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['file', 'documentType'], properties: { file: { type: 'string', format: 'binary' }, documentType: { type: 'string', enum: ['ID', 'ADDRESS_PROOF', 'OTHER'] } } } } } }, responses: { '201': { description: 'Documento asociado' }, '400': { description: 'Archivo o tipo inválido' }, '404': { description: 'Usuario no encontrado' } } } },
      '/api/products': {
        get: { tags: ['Products'], summary: 'Listar productos', parameters: [{ in: 'query', name: 'availableOnly', schema: { type: 'boolean' } }], responses: { '200': { description: 'Listado' } } },
        post: { tags: ['Products'], summary: 'Crear producto', requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Product' } } } }, responses: { '201': { description: 'Creado' }, '400': { description: 'Datos inválidos' } } }
      },
      '/api/orders': {
        get: { tags: ['Orders'], summary: 'Listar pedidos', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }], responses: { '200': { description: 'Listado' } } },
        post: { tags: ['Orders'], summary: 'Crear pedido', requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Order' } } } }, responses: { '201': { description: 'Pedido creado' }, '400': { description: 'Datos inválidos' }, '404': { description: 'Usuario o producto inexistente' } } }
      },
      '/api/orders/{id}': { get: { tags: ['Orders'], summary: 'Consultar pedido', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Pedido' }, '404': { description: 'No encontrado' } } } },
      '/api/orders/{id}/status': { patch: { tags: ['Orders'], summary: 'Actualizar estado del pedido', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] } } } } } }, responses: { '200': { description: 'Estado actualizado' }, '400': { description: 'Estado inválido' }, '404': { description: 'Pedido no encontrado' } } } },
      '/api/deliveries': {
        get: { tags: ['Deliveries'], summary: 'Listar entregas', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }], responses: { '200': { description: 'Listado' } } },
        post: { tags: ['Deliveries'], summary: 'Crear entrega', requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Delivery' } } } }, responses: { '201': { description: 'Creada' }, '404': { description: 'Pedido no encontrado' } } }
      },
      '/api/deliveries/{id}': { get: { tags: ['Deliveries'], summary: 'Consultar entrega', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Entrega' }, '404': { description: 'No encontrada' } } } },
      '/api/deliveries/{id}/proof': { post: { tags: ['Deliveries'], summary: 'Subir comprobante', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' } } } } } }, responses: { '201': { description: 'Comprobante asociado' }, '404': { description: 'Entrega no encontrada' } } } },
      '/api/mocks/users': { get: { tags: ['Mocks'], summary: 'Generar usuarios simulados sin persistir', parameters: [{ in: 'query', name: 'qty', schema: { type: 'integer', minimum: 1, maximum: 100 } }], responses: { '200': { description: 'Usuarios mock' }, '400': { description: 'Cantidad inválida' } } } },
      '/api/mocks/orders': { get: { tags: ['Mocks'], summary: 'Generar pedidos simulados', parameters: [{ in: 'query', name: 'qty', schema: { type: 'integer', minimum: 1, maximum: 100 } }], responses: { '200': { description: 'Pedidos mock' }, '400': { description: 'Cantidad inválida' } } } },
      '/api/mocks/deliveries': { get: { tags: ['Mocks'], summary: 'Generar entregas simuladas', parameters: [{ in: 'query', name: 'qty', schema: { type: 'integer', minimum: 1, maximum: 100 } }], responses: { '200': { description: 'Entregas mock' }, '400': { description: 'Cantidad inválida' } } } },
      '/api/mocks/seed': { post: { tags: ['Mocks'], summary: 'Insertar datos relacionados de prueba', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { qty: { type: 'integer', minimum: 1, maximum: 100, default: 5 } } } } } }, responses: { '201': { description: 'Datos insertados' }, '400': { description: 'Cantidad inválida' } } } },
      '/api/logger/test': { get: { tags: ['Logger'], summary: 'Emitir logs de todos los niveles (diagnóstico)', responses: { '200': { description: 'Logs emitidos' } } } }
    },
    components: {
      schemas: {
        Success: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: {} } },
        Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } } },
        User: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string' }, role: { type: 'string', enum: ['ADMIN', 'USER', 'COURIER'] } } },
        Product: { type: 'object', required: ['name', 'price', 'stock'], properties: { name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' }, status: { type: 'string', enum: ['AVAILABLE', 'OUT_OF_STOCK'] } } },
        Order: { type: 'object', required: ['user', 'items', 'destination'], properties: { user: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { product: { type: 'string' }, quantity: { type: 'integer' } } } }, destination: { type: 'string' }, priority: { type: 'string', enum: ['LOW', 'NORMAL', 'HIGH'] } } },
        Delivery: { type: 'object', required: ['order'], properties: { order: { type: 'string' }, courier: { type: 'string' }, status: { type: 'string' } } }
      }
    }
  },
  apis: []
};
export const swaggerSpec = swaggerJsdoc(options);
