var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("ecommerce", { title: "E-Commerce", user: null });
});

router.get("/admin/login", function (req, res, next) {
  res.render("login", { title: "E-Commerce", user: null });
});

module.exports = router;
