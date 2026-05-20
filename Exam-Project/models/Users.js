module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    hashedPassword: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    telephone: { type: DataTypes.STRING },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Roles",
        key: "id",
      },
      defaultValue: 1,
    },
    membershipId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Memberships",
        key: "id",
      },
      defaultValue: 1,
    },
  });

  User.associate = function (models) {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
    User.hasOne(models.Cart, { foreignKey: "userId", as: "cart" });
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
    User.belongsTo(models.Membership, {
      foreignKey: "membershipId",
      as: "membership",
    });
  };

  return User;
};
