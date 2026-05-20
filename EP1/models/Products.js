module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dateAdded: DataTypes.DATE,
    imageUrl: DataTypes.STRING,
  });

  Product.associate = function (models) {
    Product.belongsTo(models.Brand, { foreignKey: "brandId", as: "brand" });
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
  };
  return Product;
};
