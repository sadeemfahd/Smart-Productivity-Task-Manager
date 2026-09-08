const logger = require("../utils/logger");

function notFoundHandler(_req, res) {
  res.status(404).json({
    message: "Route not found"
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error("Request failed", {
    statusCode,
    message
  });

  res.status(statusCode).json({
    message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
