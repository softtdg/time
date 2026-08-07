const jwt = require('jsonwebtoken');
const config = require('../config/config');

const checkTokenValidity = async (token) => {
  return new Promise((res, rej) => {
    try {
      const decoded = jwt.verify(token, config.SECRET);
      if (decoded) {
        res(decoded);
      } else {
        rej('Your Token Is Expire.....!!');
      }
    } catch (err) {
      rej('Your Token Is Expire.....!');
    }
  });
};

module.exports = async (req, res, next) => {
  const token = req.headers.authentication;

  if (!token) {
    return res.unAuthorizedRequest({ message: 'Token Not Found....' });
  }

  checkTokenValidity(token)
    .then((result) => {
      res.locals.user = result;
      return next();
    })
    .catch((err) => {
      return res.unAuthorizedRequest({ message: err });
    });
};
