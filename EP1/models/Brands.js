module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define("Brand", {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Brand.associate = function (models) {
    Brand.hasMany(models.Product, { foreignKey: "brandId", as: "products" });
  };

  return Brand;
};
