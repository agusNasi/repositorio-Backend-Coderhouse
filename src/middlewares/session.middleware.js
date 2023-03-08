const { SESSION_KEY } = require('../constants/session.constants')

const sessionMiddleware = async (req, res, next) => {
  const cookies = req.cookies
  if (Object.keys(cookies).includes(SESSION_KEY)) {
    res.redirect('/products');
  } else {
    next();
  }
};

module.exports = {
  sessionMiddleware
}