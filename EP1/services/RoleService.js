class RoleService {
  constructor(db) {
    this.Role = db.Role;
  }

  async create(name) {
    return this.Role.create({ name });
  }

  async getAll() {
    return this.Role.findAll();
  }

  async getOne(roleId) {
    return this.Role.findByPk(roleId);
  }

  async getOneByName(roleName) {
    try {
      const role = await this.Role.findOne({ where: { name: roleName } });
      return role;
    } catch (error) {
      throw new Error(`Error getting role by name: ${error.message}`);
    }
  }

  async update(roleId, updateData) {
    return this.Role.update(updateData, {
      where: { id: roleId },
    });
  }

  async delete(roleId) {
    return this.Role.destroy({
      where: { id: roleId },
    });
  }
}

module.exports = RoleService;
