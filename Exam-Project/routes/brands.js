const express = require("express");
const router = express.Router();
const db = require("../models");
const BrandService = require("../services/BrandService");
const { authenticateJWT, isAdmin } = require("./authMiddleware");
const brandService = new BrandService(db);


router.get("/", async (req, res, next) => {
  try {
    const brands = await brandService.getAll();
    return res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.post("/", authenticateJWT, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const { brand, created } = await brandService.findOrCreate(name);
    if (created) {
      return res
        .status(201)
        .json({ success: "Brand added successfully", brand });
    } else {
      return res.status(400).json({ error: "Brand already exists." });
    }
  } catch (error) {
    console.error("Error creating brand:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/:brandId", async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await brandService.getOne(brandId);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found." });
    }

    return res.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.put("/:brandId", authenticateJWT, isAdmin, async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const updateData = req.body;
    const [updatedRows] = await brandService.update(brandId, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Brand not found." });
    }

    return res.status(200).json({ success: "Brand updated successfully" });
  } catch (error) {
    console.error("Error updating brand:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


router.delete("/:brandId", authenticateJWT, isAdmin, async (req, res, next) => {
  try {
    const { brandId } = req.params;
    await brandService.delete(brandId);
    return res.status(200).json({ success: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
