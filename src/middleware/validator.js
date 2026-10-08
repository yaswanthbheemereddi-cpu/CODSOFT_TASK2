const { ApiError } = require('./errorHandler');

function validateContact(req, res, next) {
  const { name, email, phone, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  // Clean phone spaces for format validation
  const cleanPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
  if (!phone || cleanPhone.length < 7 || cleanPhone.length > 15) {
    errors.push('A valid phone number (7 to 15 digits) is required.');
  }

  if (category) {
    const validCategories = ['personal', 'work', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed for contact', errors));
  }

  next();
}

module.exports = {
  validateContact
};
