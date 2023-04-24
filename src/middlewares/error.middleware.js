const HTTP_STATUS = require("../constants/api.constants.js")

const errorMiddleware = (error, req, res, next) => {
  req.logger.error(error.cause)
  const response = apiErrorResponse(error.description || error.message, error.details || error);
  return res.status(error.status || HTTP_STATUS.SERVER_ERROR).json(response);
};

module.exports = errorMiddleware