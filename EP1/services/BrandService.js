class BrandService {
  constructor(db) {
    this.Brand = db.Brand;
    this.Product = db.Product;
  }

  async create(name) {
    return this.Brand.create({ name });
  }

  async getAll() {
    return this.Brand.findAll({});
  }

  async findOrCreate(name) {
    const [brand, created] = await this.Brand.findOrCreate({
      where: { name },
    });
    return { brand, created };
  }

  async getOneByName(name) {
    return this.Brand.findOne({
      where: { name },
      include: [{ model: this.Product, as: "products" }],
    });
  }

  async getOne(brandId) {
    return this.Brand.findByPk(brandId, {});
  }

  async update(brandId, updateData) {
    return this.Brand.update(updateData, {
      where: { id: brandId },
    });
  }

  async delete(brandId) {
    const brand = await this.Brand.findByPk(brandId, {
      include: [
        {
          model: this.Product,
          as: "products",
        },
      ],
    });

    if (brand && brand.products.length === 0) {
      return this.Brand.destroy({
        where: { id: brandId },
      });
    } else {
      throw new Error(
        "Brand cannot be deleted because it has associated products."
      );
    }
  }
}

module.exports = BrandService;
