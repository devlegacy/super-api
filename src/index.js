// Preload env data for sequelize
import "dotenv/config";
// Load again env data for expand data
import dotenv from 'dotenv';
import dotEnvExpand from "dotenv-expand";

const myEnv = () => new Promise((resolve, reject) => {
  try {
    dotEnvExpand(dotenv.config());
    resolve();
  }
  catch (err) {
    reject(err);
  }
});

import express from "express";
import bodyParser from "body-parser";
import errorhandler from './errorhandler';

import routes from './routes/routes';
import { join } from "path";
import exphbs from "express-handlebars"

const sequelize = require('./db');
const app = express();
const { APP_PORT } = process.env;
myEnv().then(() => {
  app
    .use(bodyParser.json())
    .set('views', join(__dirname, './views'))
    .engine('.hbs', exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: join(__dirname, './views/layouts'),
      partialsDir: join(__dirname, './views/partials')
    }))
    .set('view engine', '.hbs')
    .use(routes)
    .use(errorhandler);

  sequelize.sync().then(runServer);

  function runServer() {
    const GREEN = '\x1b[32m';
    const BLUE = '\x1b[34m';
    const RESET = '\x1b[0m';
    app.listen(APP_PORT || 3001, () => {
      console.log(`${GREEN}%s${RESET} ${BLUE}%s${RESET}`, '[super-api] corriendo en:', `http://localhost:${APP_PORT || 3001}`);
    });
  }
});
