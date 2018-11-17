import sequelize from './db';
import express from "express";
import bodyParser from "body-parser";
import errorhandler from './errorhandler';

import routes from './routes/';
import { join } from "path";
import exphbs from "express-handlebars"

const app = express();
const { APP_PORT } = process.env;

/**
 * Configure app
 */
app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .set('views', join(__dirname, './views'))
  .engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: join(__dirname, './views/layouts'),
    partialsDir: join(__dirname, './views/partials')
  }))
  .set('view engine', '.hbs')
  .use(routes())
  .get('/*', (req, res) => {
    throw { message: 'PAGE NOT FOUND', statusCode: 404 };
  })
  .use(errorhandler);

/**
 * Load database
 */
sequelize
  .sync()
  .then(() => {
    /**
     * Run server
     */
    const GREEN = '\x1b[32m';
    const BLUE = '\x1b[34m';
    const RESET = '\x1b[0m';
    app.listen(APP_PORT || 3001, () => {
      console.log(`${GREEN}%s${RESET} ${BLUE}%s${RESET}`, '[super-api] corriendo en:', `http://localhost:${APP_PORT || 3001}`);
    });
  });

