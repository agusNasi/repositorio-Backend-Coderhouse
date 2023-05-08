const HTTP_STATUS = require("../constants/api.constants.js");
const HttpError = require("../utils/error.utils.js");

const errorMiddleware = (error, req, res, next) => {
  req.logger.error(error)
  const response = new HttpError(error.description || error.message, error.details || error);
  return res.status(error.status || HTTP_STATUS.SERVER_ERROR).json(response);
};

module.exports = errorMiddleware