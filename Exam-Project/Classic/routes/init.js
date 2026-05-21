const express = require("express");
const axios = require("axios"); // Import axios to make API requests
const router = express.Router();
var db = require("../models");
const crypto = require("crypto");

// Import the necessary services
const BrandService = require("../services/BrandService");
const ProductService = require("../services/ProductService");
const CategoryService = require("../services/CategoryService");
const MembershipService = require("../services/MembershipService");
const RoleService = require("../services/RoleService");
const UserService = require("../services/UserService");

// Create instances of the services
const brandService = new BrandService(db);
const productService = new ProductService(db);
const categoryService = new CategoryService(db);
const membershipService = new MembershipService(db);
const roleService = new RoleService(db);
const userService = new UserService(db);

router.post("/", async (req, res, next) => {
  try {
    console.log("Init route called");

    // Check if there are any existing records in the database
    const existingRecords = await db.Product.findAll();
    if (existingRecords.length > 0) {
      return res.status(400).json({ error: "Database already populated." });
    }

    // Fetch data from the provided API
    const apiUrl = "http://backend.restapi.co.za/items/products";
    const response = await axios.get(apiUrl);

    if (response.status !== 200) {
      console.error("Failed to fetch data from API");
      return res.status(500).json({ error: "Failed to fetch data from API" });
    }

    // Extract data from the API response
    const apiData = response.data.data;

    // Populate database tables using service methods
    for (const item of apiData) {
      const { brand, created: brandCreated } = await brandService.findOrCreate(
        item.brand
      );

      const { category, created: categoryCreated } =
        await categoryService.findOrCreate(item.category);

      await productService.create({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imgurl,
        dateAdded: item.date_added,
        brandId: brand.id,
        categoryId: category.id,
      });
    }

    // Populate roles table with two roles: Admin and User
    await roleService.create("User");
    await roleService.create("Admin");

    // Populate membership table
    const bronzeMembership = await membershipService.create("Bronze", 0); // Create variable here to use as default for the admin
    await membershipService.create("Silver", 15);
    await membershipService.create("Gold", 30);

    // Generate salt and hash the admin password
    const adminPassword = "P@ssword2023";
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(adminPassword, salt, 310000, 32, "sha256")
      .toString("hex");

    // Create an initial Admin user with hashed password and salt
    const adminUser = await userService.create(
      "Admin",
      "Support",
      "Admin",
      "admin@noroff.no",
      hashedPassword,
      salt, // Use the generated salt here
      "Online",
      "911"
    );

    const adminUserTwo = await userService.create(
      "Jobb",
      "Arbeid",
      "Arbeider",
      "jobb@bedrift.no",
      hashedPassword,
      salt, // Use the generated salt here
      "Aktiv",
      "45225771"
    );

    // Set the role for the Admin user to "Admin" and Membership to "Bronze"
    const adminRole = await roleService.getOneByName("Admin");
    await userService.update(adminUser.id, {
      roleId: adminRole.id,
      membershipId: bronzeMembership.id,
    });

    const adminRoleTwo = await roleService.getOneByName("Admin");
    await userService.update(adminUserTwo.id, {
      roleId: adminRoleTwo.id,
      membershipId: bronzeMembership.id,
    });

    return res
      .status(200)
      .json({ success: "Database populated successfully." });
  } catch (error) {
    console.error("Error populating database:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
