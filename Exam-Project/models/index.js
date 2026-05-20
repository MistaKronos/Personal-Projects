const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require("dotenv").config();

// Railway vars take priority, then local .env vars, then Clever Cloud fallback
const connection = {
  database: process.env.MYSQLDATABASE || process.env.DATABASE_NAME || process.env.MYSQL_ADDON_DB,
  username: process.env.MYSQLUSER || process.env.DB_USER || process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD :
            (process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : process.env.MYSQL_ADDON_PASSWORD),
  host: process.env.MYSQLHOST || process.env.HOST || process.env.MYSQL_ADDON_HOST,
  port: process.env.MYSQLPORT || process.env.MYSQL_ADDON_PORT || 3306,
  dialect: process.env.DIALECT || "mysql",
  dialectmodel: process.env.DIALECTMODEL || "mysql2",
};
const sequelize = new Sequelize(connection);
const db = {};
db.sequelize = sequelize;
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
module.exports = db;
