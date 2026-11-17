import { faker } from '@faker-js/faker';
import { ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../constants/index.js';
import userRepo from '../repositories/User.repository.js';
import productRepo from '../repositories/Product.repository.js';
import orderRepo from '../repositories/Order.repository.js';
import deliveryRepo from '../repositories/Delivery.repository.js';
import logger from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';

const quantity = (raw) => {
  const qty = Number(raw ?? 5);
  if (!Number.isInteger(qty) || qty < 1 || qty > 100) throw new HttpError(400, 'INVALID_MOCK_QUANTITY', 'qty debe ser un entero entre 1 y 100.');
  return qty;
};

class MockService {
  users(rawQty) {
    const qty = quantity(rawQty);
    return Array.from({ length: qty }, (_, i) => ({
      name: faker.person.fullName(),
      email: `mock-${Date.now()}-${i}-${faker.string.alphanumeric(5).toLowerCase()}@test.com`,
      password: 'Test1234!',
      role: i % 4 === 0 ? ROLES.COURIER : ROLES.USER,
      phone: faker.phone.number()
    }));
  }
  orders(rawQty) {
    const qty = quantity(rawQty);
    return Array.from({ length: qty }, () => ({
      code: `MOCK-${faker.string.alphanumeric(10).toUpperCase()}`,
      user: null,
      items: [],
      total: 0,
      status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
      priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
      destination: faker.location.streetAddress()
    }));
  }
  deliveries(rawQty) {
    const qty = quantity(rawQty);
    return Array.from({ length: qty }, () => ({ order: null, courier: null, status: DELIVERY_STATUS.PENDING }));
  }
  async seed(rawQty) {
    const qty = quantity(rawQty);
    const stamp = `${Date.now()}-${faker.string.alphanumeric(4)}`;
    const users = await userRepo.insertMany(Array.from({ length: qty }, (_, i) => ({
      name: faker.person.fullName(),
      email: `seed-user-${stamp}-${i}@test.com`,
      password: 'Test1234!',
      role: ROLES.USER
    })));
    const couriers = await userRepo.insertMany(Array.from({ length: qty }, (_, i) => ({
      name: faker.person.fullName(),
      email: `seed-courier-${stamp}-${i}@test.com`,
      password: 'Test1234!',
      role: ROLES.COURIER
    })));
    const products = await productRepo.insertMany(Array.from({ length: qty }, (_, i) => ({
      name: `Producto de prueba ${stamp}-${i}`,
      description: 'Producto generado por el módulo de mocks',
      price: Number(faker.commerce.price({ min: 100, max: 10000, dec: 2 })),
      stock: faker.number.int({ min: 1, max: 30 })
    })));
    const orders = await orderRepo.insertMany(Array.from({ length: qty }, (_, i) => {
      const product = products[i];
      const count = 1;
      return {
        code: `SEED-${stamp}-${i}`,
        user: users[i]._id,
        items: [{ product: product._id, quantity: count, unitPrice: product.price }],
        total: product.price,
        status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
        priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
        destination: faker.location.streetAddress()
      };
    }));
    const deliveries = await deliveryRepo.insertMany(orders.map((order, i) => ({
      order: order._id,
      courier: couriers[i]._id,
      status: DELIVERY_STATUS.ASSIGNED
    })));
    logger.info(`Seed generado: ${users.length} usuarios, ${couriers.length} repartidores, ${products.length} productos, ${orders.length} pedidos y ${deliveries.length} entregas`);
    return { insertados: users.length + couriers.length + products.length + orders.length + deliveries.length,
      colecciones: { usuarios: users.length, repartidores: couriers.length, productos: products.length, pedidos: orders.length, entregas: deliveries.length } };
  }
}
export default new MockService();
