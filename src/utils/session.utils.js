const jwt = require('jsonwebtoken');
const { SECRET_KEY, SESSION_KEY } = require('../config/enviroment.config.js');

const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '24h' });
  return token;
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[SESSION_KEY];
  }
  return token;
};

const generateRecoveringToken = (email) => {
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  return token;
};

module.exports = {
  generateRecoveringToken,
  generateToken,
  cookieExtractor,
};
