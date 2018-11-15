import Sequelize from "sequelize";

const { DB_DATABASE } = process.env;

const sequelize = new Sequelize('database', 'edgar_user', '3dg4r', {
  dialect: "sqlite",
  storage: "./database/database.sqlite"
});

module.exports = sequelize;
