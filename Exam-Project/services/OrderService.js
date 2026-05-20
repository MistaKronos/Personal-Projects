class OrderService {
  constructor(db) {
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
    this.Membership = db.Membership;
    this.User = db.User;
  }

  async getUserOrders(userId) {
    return await this.Order.findAll({
      where: { userId },
      include: [
        { model: this.OrderItem, as: "orderItems" },
        {
          model: this.User,
          as: "user", // Corrected alias
          attributes: ["id", "username", "membershipId"],
          include: [
            { model: this.Membership, attributes: ["type"], as: "membership" },
          ],
        },
      ],
    });
  }

  async getAllOrders() {
    return await this.Order.findAll({
      include: [{ model: this.OrderItem, as: "orderItems" }],
    });
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await this.Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = newStatus;
    await order.save();
    return order;
  }

  async updateUserMembership(userId) {
    // Retrieve the user and their order items
    const user = await this.User.findByPk(userId, {
      include: [
        {
          model: this.Order,
          as: "orders",
          include: [
            {
              model: this.OrderItem,
              as: "orderItems",
            },
          ],
        },
      ],
    });

    // Calculate the total number of items purchased
    const totalItemsPurchased = user.orders
      .flatMap((order) => order.orderItems)
      .reduce((count, item) => count + item.quantity, 0);

    let newMembershipType = "Bronze";
    if (totalItemsPurchased > 30) {
      newMembershipType = "Gold";
    } else if (totalItemsPurchased >= 15) {
      newMembershipType = "Silver";
    }

    const newMembership = await this.Membership.findOne({
      where: { type: newMembershipType },
    });

    // If the user's membership level has changed, update it
    if (user.membershipId !== newMembership.id) {
      user.membershipId = newMembership.id;
      user.save();
    }
  }

  async createOrder(userId, orderDetails) {
    const orderNumber = this.generateOrderNumber(); // Implement this method to generate a unique order number
    const newOrder = await this.Order.create({
      userId: userId,
      orderNumber: orderNumber,
      status: "In Progress", // Initial status
      totalAmount: orderDetails.totalAmount, // This needs to be calculated or passed in
      // Add any other details that your Order model requires
    });
    return newOrder;
  }

  // Method to mark an order as completed
  async completeOrder(orderId) {
    return this.updateOrderStatus(orderId, "Completed");
  }

  // Method to generate a unique order number
  generateOrderNumber() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  async deleteOrder(orderId) {
    const order = await this.Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    await order.destroy();
    return { message: "Order deleted successfully" };
  }
}

module.exports = OrderService;
