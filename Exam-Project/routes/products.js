const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");
const ProductService = require("../services/ProductService");
const { authenticateJWT, isAdmin } = require("./authMiddleware");

const productService = new ProductService(db);


router.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAll();
    return res.json(products);
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/deleted", async (req, res, next) => {
  try {
    const products = await productService.getAllDeleted();
    return res.json(products);
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productService.getOne(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.post("/search", async (req, res, next) => {
  try {
    const { productName, categoryName, brandName } = req.body;

    if (!productName && !categoryName && !brandName) {
      return res
        .status(400)
        .json({ error: "At least one search criteria is required." });
    }

    let products = [];

    if (productName) {
      products = products.concat(
        await productService.searchProducts(productName)
      );
    }

    if (categoryName) {
      products = products.concat(
        await productService.searchProductsByCategory(categoryName)
      );
    }

    if (brandName) {
      products = products.concat(
        await productService.searchProductsByBrand(brandName)
      );
    }

    const numberOfRecordsFound = products.length;
    return res.json({ products, numberOfRecordsFound });
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.post("/", authenticateJWT, isAdmin, async (req, res, next) => {
  console.log("Received data for new product:", req.body);
  try {
    // Extract product data from the request body
    const {
      name,
      description,
      quantity,
      price,
      imageUrl,
      brandId,
      categoryId,
    } = req.body;

    // Validate input
    if (
      !name ||
      !description ||
      !quantity ||
      !price ||
      !brandId ||
      !categoryId
    ) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    // Create the new product
    const product = await productService.create({
      name,
      description,
      quantity,
      price,
      imageUrl,
      brandId,
      categoryId,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.put("/:productId", authenticateJWT, isAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      quantity,
      price,
      imageUrl,
      brandId,
      categoryId,
      isDeleted,
    } = req.body;

    // Validate input
    if (
      !name ||
      !description ||
      !quantity ||
      !price ||
      !brandId ||
      !categoryId
    ) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    // Update the product
    const updatedProduct = await productService.update(productId, {
      name,
      description,
      quantity,
      price,
      imageUrl,
      brandId,
      categoryId,
      isDeleted,
    });

    return res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.delete(
  "/:productId",
  authenticateJWT,
  isAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      // Soft delete the product (update the 'deletedAt' timestamp) + isDeleted = 1 (TRUE)
      const deletedProduct = await productService.softDelete(productId);

      return res.json(deletedProduct);
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);


router.delete(
  "/fullDelete/:productId",
  authenticateJWT,
  isAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;

      // Hard delete the product from the database
      const deletedProduct = await productService.fullDelete(productId);

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error hard deleting product:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

module.exports = router;
