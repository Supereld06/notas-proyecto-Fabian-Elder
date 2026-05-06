export class CategoryService {
  constructor(repository) {
    this.repository = repository;
  }

  async createCategory(data) {
    return await this.repository.create(data);
  }

  async getCategories(userId) {
    return await this.repository.findByUser(userId);
  }

  async getCategoryById(id, userId) {
    const category = await this.repository.findById(id);

    if (!category) throw new Error("Category not found");
    if (category.userId !== userId) throw new Error("Unauthorized");

    return category;
  }

  async updateCategory(id, userId, data) {
    const category = await this.repository.findById(id);

    if (!category) throw new Error("Category not found");
    if (category.userId !== userId) throw new Error("Unauthorized");

    return await this.repository.update(id, data);
  }

  async deleteCategory(id, userId) {
    const category = await this.repository.findById(id);

    if (!category) throw new Error("Category not found");
    if (category.userId !== userId) throw new Error("Unauthorized");

    return await this.repository.delete(id);
  }
}