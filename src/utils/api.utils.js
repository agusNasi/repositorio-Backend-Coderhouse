const apiSuccessResponse = (payload) => {
  return {
    success: true,
    payload
  }
};

const apiErrorResponse = (description, error = null) => {
  return {
    success: false,
    description,
    details: error
  }
};

module.exports = { 
  apiSuccessResponse,
  apiErrorResponse
}