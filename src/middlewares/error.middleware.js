const HTTP_STATUS = require("../constants/api.constants.js")

const errorMiddleware = (error, req, res, next) => {
  console.log(error.cause);
  return res.status(error.code || HTTP_STATUS.SERVER_ERROR).json({status: 'error', error: error.name});
};

module.exports = errorMiddleware