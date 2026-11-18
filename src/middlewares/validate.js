// middleware to validate request bodies against Zod schemas

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const issues = err.issues || err.errors || [];
    const firstIssue = issues[0];
    const message = firstIssue?.message || "Validation error";
    return res.status(400).json({
      success: false,
      message,
      errors: issues,
    });
  }
};

module.exports = validate;
