require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

var ecommerceRouter = require("./routes/ecommerce");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var initRouter = require("./routes/init");
var brandsRouter = require("./routes/brands");
var cartRouter = require("./routes/cart");
var categoriesRouter = require("./routes/categories");
var ordersRouter = require("./routes/orders");
var productsRouter = require("./routes/products");
var adminHomeRouter = require("./routes/adminHome");

var db = require("./models");
db.sequelize.sync({ force: false });
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/ecommerce", ecommerceRouter);
app.use("/", authRouter);
app.use("/admin", usersRouter);
app.use("/init", initRouter);
app.use("/brands", brandsRouter);
app.use("/cart", cartRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);
app.use("/admin", adminHomeRouter);

app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
