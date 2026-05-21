const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require("dotenv").config();

// MYSQL_URL is provided automatically by Railway — use it if available.
// HOST is intentionally excluded: it's a Linux system variable set to the
// container hostname by Railway, not the database host.
let sequelize;
if (process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.MYSQL_URL, { dialect: "mysql", logging: false });
} else {
  const connection = {
    database: process.env.MYSQLDATABASE || process.env.DATABASE_NAME,
    username: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : process.env.DB_PASSWORD,
    host: process.env.MYSQLHOST || "localhost",
    port: parseInt(process.env.MYSQLPORT || "3306"),
    dialect: "mysql",
  };
  sequelize = new Sequelize(connection);
}
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
