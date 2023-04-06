const { SESSION_KEY } = require("../config/enviroment.config.js");

const authMiddleware = async (req, res, next) => {
  const cookies = req.cookies
  if (Object.keys(cookies).includes(SESSION_KEY)) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  authMiddleware
}