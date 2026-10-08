class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    let field = 'email or phone number';
    if (err.message.includes('contacts.email')) field = 'email';
    if (err.message.includes('contacts.phone')) field = 'phone number';

    return res.status(409).json({
      success: false,
      statusCode: 409,
      error: 'Duplicate Contact',
      message: `A contact with this ${field} already exists.`
    });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.name || 'Error',
    message,
    errors: err.errors || []
  });
}

module.exports = {
  ApiError,
  errorHandler
};
