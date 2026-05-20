module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    orderNumber: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("In Progress", "Ordered", "Completed"),
      defaultValue: "In Progress",
      allowNull: false,
    },
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "orderItems",
    });
  };

  return Order;
};
