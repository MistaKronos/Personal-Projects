const express = require("express");
const router = express.Router();
const db = require("../models");
const CartService = require("../services/CartService");
const cartService = new CartService(db);
const OrderService = require("../services/OrderService");
const orderService = new OrderService(db);
const MembershipService = require("../services/MembershipService");
const membershipService = new MembershipService(db);
const { authenticateJWT } = require("./authMiddleware");


router.post("/add", authenticateJWT, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Get the userId from the JWT token

  try {
    const cartItems = await cartService.addProductToCart(
      userId,
      productId,
      quantity
    );
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/items", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Get the userId from the JWT token

  try {
    const cartItems = await cartService.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/checkout", authenticateJWT, async (req, res) => {
  const userId = req.user.id; // Get the userId from the JWT token

  try {
    const newOrder = await cartService.checkoutCart(userId);

    // After successfully creating the order, update the user membership
    await orderService.updateUserMembership(userId);

    res.status(201).json({ message: "Checkout successful", order: newOrder });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
