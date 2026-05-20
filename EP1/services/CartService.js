class CartService {
  constructor(db) {
    this.Cart = db.Cart;
    this.User = db.User;
    this.Product = db.Product;
    this.CartItem = db.CartItem;
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
    this.Membership = db.Membership;
  }

  async checkoutCart(userId) {
    const transaction = await this.Cart.sequelize.transaction();
    try {
      const user = await this.User.findByPk(userId, {
        include: ["membership"],
      });

      const cart = await this.getOrCreateCartForUser(userId);
      if (!cart.cartItems.length) {
        throw new Error("Cart is empty");
      }

      let totalPrice = 0;
      let orderDetails = [];
      for (const item of cart.cartItems) {
        const product = await this.Product.findByPk(item.productId);
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        totalPrice += product.price * item.quantity;

        orderDetails.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // Apply membership discount if applicable
      let discountPercentage = user.membership ? user.membership.discount : 0;
      let discountAmount = (totalPrice * discountPercentage) / 100;
      totalPrice -= discountAmount; // Apply the discount to the total price

      const newOrder = await this.Order.create(
        {
          userId: userId,
          status: "In Progress",
          orderNumber: this.generateOrderNumber(),
          totalAmount: totalPrice,
          discount: discountAmount, // Record the discount amount for the order
        },
        { transaction }
      );

      for (const detail of orderDetails) {
        await this.OrderItem.create(
          {
            orderId: newOrder.id,
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
          },
          { transaction }
        );

        await this.Product.decrement("quantity", {
          by: detail.quantity,
          where: { id: detail.productId },
          transaction,
        });
      }

      await this.CartItem.destroy({ where: { cartId: cart.id }, transaction });

      await transaction.commit();
      return newOrder;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  generateOrderNumber() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async getOrCreateCartForUser(userId) {
    let cart = await this.Cart.findOne({
      where: { userId, status: "Active" },
      include: [
        {
          model: this.CartItem,
          as: "cartItems",
          include: ["product"], // Include product details of each cart item
        },
      ],
    });
    if (!cart) {
      cart = await this.Cart.create({ userId });
    }
    return cart;
  }

  async addProductToCart(userId, productId, quantity) {
    // First check if the quantity is a valid integer greater than 0
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(
        "Invalid quantity. You can only add whole number quantities to the cart."
      );
    }

    // Proceed to find the cart and the product
    const cart = await this.getOrCreateCartForUser(userId);
    const product = await this.Product.findByPk(productId);

    if (!product) {
      throw new Error("Product does not exist");
    }

    // Check if the product is out of stock
    if (product.quantity < 1) {
      throw new Error(`Product ${product.name} is out of stock`);
    }

    // Check if there is enough stock to fulfill the request
    if (product.quantity < quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Only ${product.quantity} left.`
      );
    }

    // Check for existing cart item and adjust quantity
    let cartItem = await this.CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      if (cartItem.quantity + quantity > product.quantity) {
        throw new Error(
          `Cannot add more ${product.name} to cart. Insufficient stock.`
        );
      }
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await this.CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    // Return updated cart items
    return this.CartItem.findAll({
      where: { cartId: cart.id },
      include: "product",
    });
  }

  async getCartItems(userId) {
    const cart = await this.Cart.findOne({
      where: { userId, status: "Active" },
    });
    if (!cart) {
      return [];
    }

    return this.CartItem.findAll({
      where: { cartId: cart.id },
      include: "product",
    });
  }

  async updateCartItemQuantity(cartItemId, newQuantity) {
    const cartItem = await this.CartItem.findByPk(cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();

    return cartItem;
  }

  async removeItemFromCart(cartItemId) {
    const cartItem = await this.CartItem.findByPk(cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    await cartItem.destroy();
  }
}

module.exports = CartService;
