const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = err.statusCode || err.status || 500;
  let message = err.message || "Server error";

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path || "resource"} ID format`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    status = 400;
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    message = messages.length > 0 ? messages.join(", ") : "Validation failed";
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Duplicate value for ${field}` : "Duplicate record already exists";
  }

  // Handle JSON parse errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    status = 400;
    message = "Invalid JSON payload format";
  }

  // Don't expose error details in production for 500 errors
  const response = {
    success: false,
    message:
      process.env.NODE_ENV === "production" && status === 500
        ? "Internal server error"
        : message,
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;
