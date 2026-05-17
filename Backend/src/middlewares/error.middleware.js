const errorHandler = (err, req, res, next) => {
  // if status code not set
  const statusCode = res.statusCode || 500;
  res.status(statusCode);

  res.json({
    success: false,
    message: err.message || "server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
