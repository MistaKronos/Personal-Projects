module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define("Membership", {
    type: {
      type: DataTypes.ENUM("Bronze", "Silver", "Gold"),
      allowNull: false,
      defaultValue: "Bronze", // Default membership type
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, // Default discount for Bronze
    },
  });

  Membership.associate = function (models) {
    Membership.hasMany(models.User, {
      foreignKey: "membershipId",
      as: "users",
    });
  };

  return Membership;
};
