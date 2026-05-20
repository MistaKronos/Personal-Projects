module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    status: {
      type: DataTypes.ENUM("Active", "Checked Out", "Abandoned"),
      defaultValue: "Active",
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    isSoftDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "cartItems" });
  };

  return Cart;
};
