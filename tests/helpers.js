import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.model.js';
import Product from '../src/models/Product.model.js';
import Order from '../src/models/Order.model.js';
import Delivery from '../src/models/Delivery.model.js';

let mongo;
export async function connectTestDatabase() {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}
export async function cleanDatabase() {
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({}), Delivery.deleteMany({})]);
}
export async function disconnectTestDatabase() {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}
