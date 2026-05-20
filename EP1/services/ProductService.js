const { Op } = require("sequelize");

class ProductService {
  constructor(db) {
    this.client = db.sequelize;
    this.Product = db.Product;
    this.Category = db.Category;
    this.Brand = db.Brand;
    this.OrderItem = db.OrderItem;
    this.CartItem = db.CartItem;
  }

  async create(productData) {
    console.log("Creating product with data:", productData);
    return this.Product.create(productData).catch((error) => {
      console.error("Error in ProductService.create:", error);
      throw error;
    });
  }

  async searchProducts(productName) {
    try {
      const query = `
        SELECT p.*
        FROM Products p
        WHERE p.name LIKE :productName
      `;

      const products = await this.client.query(query, {
        replacements: { productName: `%${productName}%` },
        type: this.client.QueryTypes.SELECT,
      });
      console.log("searchProducts results:", products);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async searchProductsByCategory(categoryName) {
    try {
      const query = `
      SELECT p.*, c.name as categoryName, b.name as brandName
      FROM Products p
      LEFT JOIN Categories c ON p.categoryId = c.id
      LEFT JOIN Brands b ON p.brandId = b.id
      WHERE c.name = :categoryName
    `;

      const products = await this.client.query(query, {
        replacements: { categoryName: categoryName },
        type: this.client.QueryTypes.SELECT,
      });
      console.log("searchProductsByCategory results:", products);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async searchProductsByBrand(brandName) {
    try {
      const query = `
        SELECT p.*, b.name as brandName, c.name as categoryName
        FROM Products p
        LEFT JOIN Categories c ON p.categoryId = c.id
        LEFT JOIN Brands b ON p.brandId = b.id
        WHERE b.name = :brandName
      `;

      const products = await this.client.query(query, {
        replacements: { brandName: brandName },
        type: this.client.QueryTypes.SELECT,
      });
      console.log("searchProductsByBrand results:", products);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    return this.Product.findAll({
      include: [
        {
          model: this.Category,
          as: "category",
        },
        {
          model: this.Brand,
          as: "brand",
        },
      ],
    });
  }

  async getAllDeleted(includeDeleted = false) {
    const whereCondition = includeDeleted ? {} : { isDeleted: true };

    return this.Product.findAll({
      where: whereCondition,
    });
  }

  async getOne(productId) {
    return this.Product.findByPk(productId, {});
  }

  async update(productId, updateData) {
    return this.Product.update(updateData, {
      where: { id: productId },
    });
  }

  async softDelete(productId) {
    return this.Product.update(
      { isDeleted: true },
      {
        where: { id: productId },
      }
    );
  }

  async fullDelete(productId) {
    return this.Product.destroy({
      where: { id: productId },
    });
  }
}

module.exports = ProductService;
