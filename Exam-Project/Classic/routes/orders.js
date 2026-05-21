const express = require("express");
const router = express.Router();
const db = require("../models");
const OrderService = require("../services/OrderService");
const orderService = new OrderService(db);
const { authenticateJWT, isAdmin } = require("./authMiddleware");


router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await orderService.getUserOrders(userId);
    res.json({ orders });
  } catch (error) {
    console.error("View orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/all", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const allOrders = await orderService.getAllOrders();
    res.json({ allOrders });
  } catch (error) {
    console.error("Admin view orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/:orderId", authenticateJWT, isAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  try {
    await orderService.updateOrderStatus(orderId, newStatus);
    res.json({ message: "Order status updated" });
  } catch (error) {
    console.error("Admin update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/", authenticateJWT, isAdmin, async (req, res) => {
  // Assuming order details are sent in the request body
  try {
    const newOrder = await orderService.createOrder(req.body);
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:orderId", authenticateJWT, isAdmin, async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
