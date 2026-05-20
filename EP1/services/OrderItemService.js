class OrderItemService {
  constructor(db) {
    this.OrderItem = db.OrderItem;
  }

  async create(orderId, productId, quantity, unitPrice) {
    // Logic to create a new order item
    return this.OrderItem.create({
      orderId,
      productId,
      quantity,
      unitPrice,
    });
  }

  async getByOrderId(orderId) {
    // Logic to get all order items for a specific order
    return this.OrderItem.findAll({
      where: { orderId },
    });
  }

  async update(orderItemId, updatePayload) {
    // Logic to update an order item
    const orderItem = await this.OrderItem.findByPk(orderItemId);
    if (orderItem) {
      return orderItem.update(updatePayload);
    } else {
      throw new Error("Order item not found");
    }
  }

  async delete(orderItemId) {
    // Logic to delete an order item
    const orderItem = await this.OrderItem.findByPk(orderItemId);
    if (orderItem) {
      return orderItem.destroy();
    } else {
      throw new Error("Order item not found");
    }
  }
}

module.exports = OrderItemService;
