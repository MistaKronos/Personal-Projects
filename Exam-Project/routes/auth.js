const express = require("express");
const router = express.Router();
const db = require("../models");
const crypto = require("crypto");
const UserService = require("../services/UserService");
const userService = new UserService(db);
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
router.use(bodyParser.json());


router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email == null || !email.includes("@")) {
    return res.status(400).json({ "error": "Email is required." });
  }
  if (password == null) {
    return res.status(400).json({ "error": "Password is required." });
  }

  try {
    const user = await userService.getByEmail(email);

    if (!user) {
      return res.status(400).json({ "error": "Couldn't log in" });
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
      .toString("hex");
    if (user.hashedPassword !== hashedPassword) {
      return res.status(401).json({ "error": "Incorrect email or password" });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role.name },
        process.env.TOKEN_SECRET,
        { expiresIn: "2h" }
      );
    } catch (err) {
      console.error("Error creating JWT token:", err);
      return res.status(500).json({
        "error": "Something went wrong with creating the JWT token"
      });
    }

    res.status(200).json({
      "result": "You are logged in",
      "id": user.id,
      email: user.email,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ "error": "Server error" });
  }
});


router.post("/signup", async (req, res) => {
  const { firstName, lastName, username, email, password, address, telephone } = req.body;

  if (!firstName) {
    return res.status(400).json({ "error": "First name is required." });
  }
  if (!lastName) {
    return res.status(400).json({ "error": "Last name is required." });
  }
  if (!username) {
    return res.status(400).json({ "error": "Username is required." });
  }
  if (!email) {
    return res.status(400).json({ "error": "A valid email is required." });
  }
  if (!password) {
    return res.status(400).json({ "error": "Password is required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ "error": "Password must be at least 6 characters long." });
  }
  if (!address) {
    return res.status(400).json({ "error": "Address is required." });
  }
  if (!telephone || !/^\d{10}$/.test(telephone)) {
    return res.status(400).json({
      "error": "A valid 10-digit telephone number is required.",
    });
  }

  try {
    const existingUser = await userService.getByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ "error": "Provided email is already in use." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 310000, 32, "sha256")
      .toString("hex");

    const newUser = await userService.create(
      firstName,
      lastName,
      username,
      email.toLowerCase(),
      hashedPassword,
      salt,
      address,
      telephone
    );

    res.status(201).json({
      "result": "You created an account.",
      "user": {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        address: newUser.address,
        telephone: newUser.telephone
      }
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ "error": "Server error" });
  }
});


router.post("/admin/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await userService.getByEmail(email);
    if (!user || user.role.name !== "Admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Password verification and token generation logic
    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
      .toString("hex");
    if (user.hashedPassword === hashedPassword) {
      // Successful login, generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role.name },
        process.env.TOKEN_SECRET,
        { expiresIn: "2h" }
      );

      console.log("Token set for user:", token);
      res.cookie("token", token, { httpOnly: true, maxAge: 7200000 }); // 2 hours expiration
      res.json({ message: "Authentication successful" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/admin/logout", (req, res) => {
  try {
    res.clearCookie("token"); // Clear the cookie
    res.redirect("/admin/login");
  } catch (error) {
    console.error("Error during admin logout:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
