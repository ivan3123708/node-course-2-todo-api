const { User } = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token)
    .then((foundUser) => {
      if (foundUser) {
        req.user = foundUser;
        req.token = token;

        next();
      } else {
        return Promise.reject();
      }
    })
    .catch((err) => {
      res.status(401).send();
    });
};

module.exports = { authenticate };