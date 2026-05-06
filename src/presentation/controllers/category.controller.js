export class CategoryController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    const category = await this.service.createCategory({
      name: req.body.name,
      userId: req.user.id
    });

    res.status(201).json(category);
  };

  getAll = async (req, res) => {
    const categories = await this.service.getCategories(req.user.id);
    res.json(categories);
  };

  getById = async (req, res) => {
    const category = await this.service.getCategoryById(
      req.params.id,
      req.user.id
    );
    res.json(category);
  };

  update = async (req, res) => {
    const updated = await this.service.updateCategory(
      req.params.id,
      req.user.id,
      { name: req.body.name }
    );
    res.json(updated);
  };

  delete = async (req, res) => {
    await this.service.deleteCategory(req.params.id, req.user.id);
    res.json({ message: "Category deleted" });
  };
}
