import User from '../models/User.model.js';

class UserRepository {
  findAll({ skip, limit, filters = {} }) {
    return User.find(filters).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
  countAll(filters = {}) { return User.countDocuments(filters); }
  findById(id) { return User.findById(id).select('-password'); }
  findByIdForRelation(id) { return User.findById(id); }
  findByEmail(email) { return User.findOne({ email: email.toLowerCase() }); }
  create(data) { return User.create(data); }
  addDocument(id, metadata) { return User.findByIdAndUpdate(id, { $push: { documents: metadata } }, { new: true }).select('-password'); }
  insertMany(data) { return User.insertMany(data); }
  deleteAll() { return User.deleteMany({}); }
}
export default new UserRepository();
