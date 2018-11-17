import mod from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { API_ACCESS_TOKEN_SECRET, API_ACCESS_TOKEN_LIFE } = process.env;

module.exports = {
  login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    mod.User
      .findOne({ where: { username: username } })
      .then((user) => {
        return user;
      })
      .then((user) => {
        const userPassword = user.password || '';
        bcrypt
          .compare(password, userPassword)
          .then(function (isMatch) {
            if (isMatch) {
              const payLoad = {
                "id": user.id
              };

              const accessToken = jwt.sign(payLoad, API_ACCESS_TOKEN_SECRET,
                {
                  expiresIn: parseInt(API_ACCESS_TOKEN_LIFE)
                });
              const response = {
                "access_token": accessToken,
                "token_type": "Bearer"
              };
              res.status(200).send(response);
            } else {
              let error = {};
              error.message = "Bad credentials";
              throw error
            }
          })
          .catch((err) => {
            res.status(401).send(err);
          });
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
};
