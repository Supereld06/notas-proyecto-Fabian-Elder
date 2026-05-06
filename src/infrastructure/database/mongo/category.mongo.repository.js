import { CategoryModel } from "./category.model.js";

export class CategoryRepository {
  async create(data) {
    return await CategoryModel.create(data);
  }

  async findByUser(userId) {
    return await CategoryModel.find({ userId });
  }

  async findById(id) {
    return await CategoryModel.findById(id);
  }

  async update(id, data) {
    return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await CategoryModel.findByIdAndDelete(id);
  }
}