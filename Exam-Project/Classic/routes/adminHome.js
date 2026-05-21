const express = require("express");
const router = express.Router();
const db = require("../models");
const { authenticateJWT, isAdmin } = require("./authMiddleware");
const ProductService = require("../services/ProductService");
const productService = new ProductService(db);
const BrandService = require("../services/BrandService");
const brandService = new BrandService(db);
const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);
const RoleService = require("../services/RoleService");
const roleService = new RoleService(db);
const OrderService = require("../services/OrderService");
const orderService = new OrderService(db);


router.get("/login", (req, res) => {
  res.render("ecommerce", { title: "Admin Login", user: null });
});

router.get("/", authenticateJWT, isAdmin, (req, res) => {
  res.render("adminHome", { title: "Admin Dashboard", user: req.user });
});


router.get("/products", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const products = await productService.getAll();
    const brands = await brandService.getAll();
    const categories = await categoryService.getAll();
    res.render("products", { products, brands, categories, user: req.user });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});


router.get("/brands", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const brands = await brandService.getAll();
    res.render("brands", { brands, user: req.user });
  } catch (error) {
    console.error("Error listing brands:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});


router.get("/categories", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const categories = await categoryService.getAll();
    res.render("categories", { categories, user: req.user });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});


router.get("/roles", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const roles = await roleService.getAll();
    res.render("roles", { roles, user: req.user });
  } catch (error) {
    console.error("Error listing roles:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});


router.get("/orders", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.render("orders", { orders, user: req.user });
  } catch (error) {
    console.error("Error listing orders:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});

module.exports = router;
