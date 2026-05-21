module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
  });

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
  };

  return OrderItem;
};
