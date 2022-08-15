function errorHandler(error, request, response, next) {
  response.status(error.status).json({ message: error.message });
}

module.exports = { errorHandler };
