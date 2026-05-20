class CategoryService {
  constructor(db) {
    this.Category = db.Category;
    this.Product = db.Product;
  }

  async create(name) {
    return this.Category.create({ name });
  }

  async getAll() {
    return this.Category.findAll({});
  }

  async findOrCreate(name) {
    const [category, created] = await this.Category.findOrCreate({
      where: { name },
    });
    return { category, created };
  }

  async getOneByName(name) {
    return this.Category.findOne({
      where: { name },
      include: [{ model: this.Product, as: "products" }],
    });
  }

  async getOne(categoryId) {
    return this.Category.findByPk(categoryId, {});
  }

  async update(categoryId, updateData) {
    return this.Category.update(updateData, {
      where: { id: categoryId },
    });
  }

  async delete(categoryId) {
    const category = await this.Category.findByPk(categoryId, {
      include: [
        {
          model: this.Product,
          as: "products",
        },
      ],
    });

    if (category && category.products.length === 0) {
      return this.Category.destroy({
        where: { id: categoryId },
      });
    } else {
      throw new Error(
        "Category cannot be deleted because it has associated products."
      );
    }
  }
}

module.exports = CategoryService;
