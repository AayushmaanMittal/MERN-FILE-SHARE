const { check } = require("express-validator")

// Validation rules for user registration
exports.registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
]

// Validation rules for user login
exports.loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
]

// Validation rules for profile update
exports.profileUpdateValidation = [
  check("name", "Name must be at least 2 characters").optional().isLength({ min: 2 }),
  check("newPassword", "Password must be at least 6 characters").optional().isLength({ min: 6 }),
]

// Validation rules for file upload
exports.fileUploadValidation = [check("recipientEmail", "Valid recipient email is required").isEmail()]

// Validation rules for account deletion
exports.accountDeletionValidation = [check("password", "Password is required").exists()]
