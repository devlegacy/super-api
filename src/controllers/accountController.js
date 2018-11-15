import fs from "fs"
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import handlebars from "handlebars"
import sequelize from "../db";
import models from "../models";
import bcrypt from "bcrypt";

const {
  MAILER_SERVICE_PROVIDER,
  MAILER_EMAIL_ID,
  MAILER_PASSWORD,
  MAILER_SENDER,
  APP_URL,
  API_ACCESS_TOKEN_SECRET,
  API_ACCESS_TOKEN_LIFE,
} = process.env;

const smtpTransport = nodemailer.createTransport({
  service: MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: MAILER_EMAIL_ID || 'auth_email_address@gmail.com',
    pass: MAILER_PASSWORD || 'auth_email_pass'
  }
});

module.exports = {

  register(req, res) {
    console.log("REGISTER");
    let createUser = (userData) => {
      return models.User.create(userData)
    };
    let getRoles = models.Role.findAll({
      where: {
        name: {
          [sequelize.Op.or]: ['user']
        }
      }
    });


    bcrypt
      .hash(req.body.password, 10)
      .then((hashedPassword) => {
        return hashedPassword;
      }).then((hashedPassword) => {
        console.log("SE ENCRIPTO");
        console.log("hashedPassword", JSON.stringify(hashedPassword));
        req.body.password = hashedPassword;
        return Promise.all([createUser(req.body), getRoles])
      }).then((values) => {
        const [user, role] = values;
        user.setRoles(role);
        return user;
      }).then((user) => {

        console.log("SE CREO EL USUARIO");
        console.log("values", JSON.stringify(user));
        const payLoad = {
          "id": user.id
        };
        const emailToken = jwt.sign(payLoad, API_ACCESS_TOKEN_SECRET, {
          expiresIn: API_ACCESS_TOKEN_LIFE
        });


        const data = {
          username: user.username,
          link: `${APP_URL}/confirmation/${emailToken}`
        };
        const source = fs.readFileSync(path.join(__dirname, '../views/email-templates', 'accountConfirmation.hbs'), 'utf8');
        const template = handlebars.compile(source);
        const html = template(data);
        const mailOptions = {
          from: MAILER_SENDER,
          to: user.email,
          subject: "Don't wait! Activate your account",
          html: html
        };
        smtpTransport.sendMail(mailOptions, function (err, info) {
          if (err) {
            throw err;
          }
          else {
            res.status(201).send(user);
          }
        });
      }).catch((error) => {
        res.status(500).send(error);
      });
  },

  confirmation(req, res) {
    const token = req.body.token;
    try {
      const decoded = jwt.verify(token, API_ACCESS_TOKEN_SECRET);
      let updateValues = {
        confirmed: true
      };
      models.User.findOne({
        where: {
          id: decoded.id
        }
      }).then((user) => {
        if (user.confirmed) {
          let error = {
            statusCode: 401,
            message: "This email has already been verified",
          };
          throw error;
        }
        return models.User.update(updateValues, {
          where: {
            id: decoded.id
          },
          returning: true,
          plain: true
        });
      }).then(() => {
        res.status(200).send({
          message: "You have successfully verified your email address"
        });
      }).catch((error) => {
        if (error.statusCode) {
          res.status(error.statusCode).send({
            message: error.message,
          });
        } else {
          res.status(500).send(error);
        }
      });
    } catch (err) {
      res.status(401).send({
        message: err.message,
      })
    }
  },

  renderConfirmation(req, res) {
    const token = req.params.token;
    try {
      const decoded = jwt.verify(token, API_ACCESS_TOKEN_SECRET);
      let data = {
        title: "Confirmation",
        token: token,
        decoded: decoded
      };
      res.render('confirmation', data);
    } catch (err) {

      let data = {
        title: err.name,
        message: err.message
      };
      res.status(401).render('error', data);
    }
  },

  renderForgotPassword(req, res) {
    let data = {
      title: "Forgot Password"
    };
    res.render('forgotPassword', data);
  },

  renderResetPassword(req, res) {
    const token = req.params.token;
    try {
      const decoded = jwt.verify(token, API_ACCESS_TOKEN_SECRET);
      let data = {
        title: "Reset Password",
        token: token,
        decoded: decoded
      };
      res.render('resetPassword', data);
    } catch (err) {

      let data = {
        title: err.name,
        message: err.message
      };
      res.status(401).render('error', data);
    }
  },

  forgotPassword(req, res) {
    const email = req.body.email;
    models.User.findOne({
      where: {
        email: email
      }
    }).then((user) => {
      if (user === null) {
        let error = {
          statusCode: 401,
          message: "User not found"
        };
        throw error;
      }
      const payLoad = {
        "id": user.id
      };
      const token = jwt.sign(payLoad, API_ACCESS_TOKEN_SECRET, {
        expiresIn: API_ACCESS_TOKEN_LIFE
      });

      //?token=
      const data = {
        username: user.username,
        url: `${APP_URL}/reset_password/${token}`
      };
      const source = fs.readFileSync(path.join(__dirname, '../views/email-templates', 'forgotPassword.hbs'), 'utf8');
      const template = handlebars.compile(source);
      const html = template(data);
      const mailOptions = {
        from: MAILER_SENDER,
        to: user.email,
        subject: "Password help has arrived!",
        html: html
      };
      return mailOptions;
    }).then((mailOptions) => {
      return smtpTransport.sendMail(mailOptions);
    }).then(() => {
      res.status(200).send({
        message: 'Kindly check your email for further instructions'
      });
    }).catch((error) => {
      if (error.statusCode) {
        res.status(error.statusCode).send({
          message: error.message
        });
      } else {
        res.status(500).send(error);
      }
    });
  },

  resetPassword(req, res) {
    const token = req.body.token;
    const password = req.body.newPassword;
    try {
      nfi
      const decoded = jwt.verify(token, API_ACCESS_TOKEN_SECRET);
      models.User.findOne({
        where: {
          id: decoded.id
        }
      }).then((user) => {
        if (user === null) {
          let error = {
            statusCode: 401,
            message: "User not found"
          };
          throw error;
        }
        return bcrypt.hash(password, 10)
          .then((hashedPassword) => {
            return [user, hashedPassword];
          })
      }).then((result) => {

        const [user, hashedPassword] = result;

        let updateValues = {
          password: hashedPassword
        };
        return models.User.update(updateValues, {
          where: {
            id: user.id
          },
          returning: true,
          plain: true
        }).then(() => {
          return user;
        })
      })
        .then((user) => {
          const data = {
            username: user.username,
          };
          const source = fs.readFileSync(path.join(__dirname, '../views/email-templates', 'resetPassword.hbs'), 'utf8');
          const template = handlebars.compile(source);
          const html = template(data);
          const mailOptions = {
            from: MAILER_SENDER,
            to: user.email,
            subject: "Password Reset Confirmation",
            html: html
          };
          smtpTransport.sendMail(mailOptions, function (err, info) {
            if (err) {
              throw err;
            }
            else {
              res.status(200).send({ message: 'Password reset' });
            }
          });
        }).catch((error) => {
          if (error.statusCode) {
            res.status(error.statusCode).send({
              message: error.message
            });
          } else {
            res.status(500).send(error);
          }
        })
    } catch (err) {
      res.status(401).send({
        "message": err.message,
      })
    }
  },

};
