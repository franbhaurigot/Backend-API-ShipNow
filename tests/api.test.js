import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectTestDatabase, cleanDatabase, disconnectTestDatabase } from './helpers.js';
import User from '../src/models/User.model.js';
import Product from '../src/models/Product.model.js';
import { ROLES } from '../src/constants/index.js';

describe('ShipNow API - pruebas funcionales', function () {
  this.timeout(30000);
  let user;
  let product;

  before(async () => { await connectTestDatabase(); });
  beforeEach(async () => {
    await cleanDatabase();
    user = await User.create({ name: 'Usuario Test', email: 'usuario@test.com', password: 'Test1234!', role: ROLES.USER });
    product = await Product.create({ name: 'Producto Test', price: 1200, stock: 10 });
  });
  after(async () => { await disconnectTestDatabase(); });

  it('GET /api/users lista usuarios', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.length(1);
  });

  it('POST /api/users valida campos obligatorios', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Incompleto' });
    expect(res.status).to.equal(400);
    expect(res.body.error.code).to.equal('INVALID_USER');
  });

  it('GET /api/products lista productos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).to.equal(200);
    expect(res.body.data[0].name).to.equal('Producto Test');
  });

  it('POST /api/products crea producto', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Nuevo', price: 200, stock: 3 });
    expect(res.status).to.equal(201);
    expect(res.body.data.name).to.equal('Nuevo');
  });

  it('GET /api/orders lista pedidos', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
  });

  it('POST /api/orders crea pedido y calcula total', async () => {
    const res = await request(app).post('/api/orders').send({
      user: user.id, items: [{ product: product.id, quantity: 2 }], destination: 'Av. Test 123'
    });
    expect(res.status).to.equal(201);
    expect(res.body.data.total).to.equal(2400);
    expect(res.body.data.items).to.have.length(1);
  });

  it('GET /api/orders/:id responde 404 si no existe', async () => {
    const res = await request(app).get(`/api/orders/${new mongoose.Types.ObjectId()}`);
    expect(res.status).to.equal(404);
    expect(res.body.error.code).to.equal('ORDER_NOT_FOUND');
  });

  it('PATCH /api/orders/:id/status rechaza estado inválido', async () => {
    const created = await request(app).post('/api/orders').send({
      user: user.id, items: [{ product: product.id, quantity: 1 }], destination: 'Destino'
    });
    const res = await request(app).patch(`/api/orders/${created.body.data._id}/status`).send({ status: 'VOLANDO' });
    expect(res.status).to.equal(400);
    expect(res.body.error.code).to.equal('INVALID_ORDER_STATUS');
  });

  it('GET /api/mocks/users devuelve datos sin persistir', async () => {
    const res = await request(app).get('/api/mocks/users?qty=2');
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.length(2);
    expect(await User.countDocuments()).to.equal(1);
  });

  it('GET /api/mocks/users rechaza cantidades inválidas', async () => {
    const res = await request(app).get('/api/mocks/users?qty=-1');
    expect(res.status).to.equal(400);
    expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
  });

  it('POST /api/mocks/seed inserta entidades relacionadas', async () => {
    const res = await request(app).post('/api/mocks/seed').send({ qty: 2 });
    expect(res.status).to.equal(201);
    expect(res.body.data.colecciones.pedidos).to.equal(2);
    expect(await User.countDocuments()).to.equal(5); // usuario base + 2 usuarios + 2 repartidores
  });

  it('GET /api/logger/test ejecuta el endpoint de diagnóstico', async () => {
    const res = await request(app).get('/api/logger/test');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
  });

  it('GET /api/docs expone Swagger UI', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('swagger-ui');
  });

  it('ruta inexistente devuelve error uniforme', async () => {
    const res = await request(app).get('/no-existe');
    expect(res.status).to.equal(404);
    expect(res.body.success).to.equal(false);
    expect(res.body.error.code).to.equal('ROUTE_NOT_FOUND');
  });

  it('POST /api/deliveries valida pedido inexistente', async () => {
    const res = await request(app).post('/api/deliveries').send({ order: new mongoose.Types.ObjectId().toString() });
    expect(res.status).to.equal(404);
    expect(res.body.error.code).to.equal('ORDER_NOT_FOUND');
  });
});
