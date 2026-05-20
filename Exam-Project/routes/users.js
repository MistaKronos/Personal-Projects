var express = require("express");
var router = express.Router();
var db = require("../models");
const { authenticateJWT, isAdmin } = require("./authMiddleware");
var UserService = require("../services/UserService");
var userService = new UserService(db);

router.get("/users", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await userService.getAll();
    res.render("users", { users, user: req.user });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).render("error", { error: "Internal server error." });
  }
});


router.post(
  "/users/:userId/changerole",
  authenticateJWT,
  isAdmin,
  async function (req, res, next) {
    const userId = req.params.userId;
    const { roleId } = req.body;

    try {
      const updated = await userService.update(userId, {
        roleId: parseInt(roleId, 10),
      });
      if (updated[0] > 0) {
        res.json({ message: "User role updated successfully" });
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
