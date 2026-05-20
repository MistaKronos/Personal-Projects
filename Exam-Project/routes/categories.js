const express = require("express");
const router = express.Router();
const db = require("../models");
const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);
const { authenticateJWT, isAdmin } = require("./authMiddleware");


router.get("/", async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    return res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.post("/", authenticateJWT, isAdmin, async (req, res, next) => {
  try {
    const { name } = req.body;
    const { category, created } = await categoryService.findOrCreate(name);

    if (created) {
      return res
        .status(201)
        .json({ success: "Category added successfully", category });
    } else {
      return res.status(400).json({ error: "Category already exists." });
    }
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.getOne(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    return res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.put("/:categoryId", authenticateJWT, isAdmin, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;
    const [updatedRows] = await categoryService.update(categoryId, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    return res.status(200).json({ success: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.delete(
  "/:categoryId",
  authenticateJWT,
  isAdmin,
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      await categoryService.delete(categoryId);
      return res.status(200).json({ success: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

module.exports = router;
