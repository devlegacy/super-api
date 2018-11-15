import Sequelize from "sequelize";
/**
 * Load env and env expand config for all app
 * TODO: Read about why this code don't work in index.js
 */
import dotenv from 'dotenv';
import dotEnvExpand from "dotenv-expand";
dotEnvExpand(dotenv.config());

const {
  DB_CONNECTION,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_CONNECTION,
  storage: `./database/${DB_DATABASE}.sqlite`
});

export default sequelize;
