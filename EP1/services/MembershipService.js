class MembershipService {
  constructor(db) {
    this.Membership = db.Membership;
  }

  async create(type, discount) {
    return this.Membership.create({ type, discount });
  }

  async getAll() {
    return this.Membership.findAll();
  }

  async getOne(membershipId) {
    return this.Membership.findByPk(membershipId);
  }

  async update(membershipId, updateData) {
    return this.Membership.update(updateData, {
      where: { id: membershipId },
    });
  }

  async delete(membershipId) {
    return this.Membership.destroy({
      where: { id: membershipId },
    });
  }
}

module.exports = MembershipService;
