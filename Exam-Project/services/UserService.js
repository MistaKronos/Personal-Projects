const { Op } = require("sequelize");

class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.User = db.User;
    this.Order = db.Order;
    this.Cart = db.Cart;
    this.Role = db.Role;
    this.Membership = db.Membership;
  }

  async create(
    firstName,
    lastName,
    username,
    email,
    hashedPassword,
    salt, // Accept the salt as a parameter
    address,
    telephone
  ) {
    return this.User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      salt: salt, // Store the salt in the database
      address: address,
      telephone: telephone,
    });
  }

  async getAll() {
    return this.User.findAll({
      include: [
        {
          model: this.Order,
          as: "orders",
        },
        {
          model: this.Cart,
          as: "cart",
        },
        {
          model: this.Role,
          as: "role",
        },
        {
          model: this.Membership,
          as: "membership",
        },
      ],
    });
  }

  async getOne(userId) {
    return this.User.findByPk(userId, {
      include: [
        {
          model: this.Order,
          as: "orders",
        },
        {
          model: this.Cart,
          as: "cart",
        },
      ],
    });
  }

  async getOneByUsername(username) {
    return this.User.findOne({
      where: { username: username },
      include: [
        {
          model: this.Order,
          as: "orders",
        },
        {
          model: this.Cart,
          as: "cart",
        },
      ],
    });
  }

  async getByEmail(email) {
    return this.User.findOne({
      where: { email: email },
      include: [
        {
          model: this.Role,
          as: "role",
        },
        {
          model: this.Membership,
          as: "membership",
        },
      ],
    });
  }

  async update(userId, updateData) {
    return this.User.update(updateData, {
      where: { id: userId },
    });
  }

  async delete(userId) {
    return this.User.destroy({
      where: {
        id: userId,
        roleId: {
          [Op.not]: this.Role.findOne({ where: { name: "Admin" } }).id,
        },
      },
    });
  }
}

module.exports = UserService;
