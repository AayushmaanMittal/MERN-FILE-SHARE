const express = require("express")
const { check } = require("express-validator")
const userController = require("../controllers/userController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get user profile route
router.get("/profile", auth, userController.getUserProfile)

// Update user profile route
router.put(
  "/profile",
  auth,
  [
    check("name", "Name must be at least 2 characters").optional().isLength({ min: 2 }),
    check("newPassword", "Password must be at least 6 characters").optional().isLength({ min: 6 }),
  ],
  userController.updateUserProfile,
)

// Get user statistics route
router.get("/stats", auth, userController.getUserStats)

// Delete user account route
router.delete("/account", auth, [check("password", "Password is required").exists()], userController.deleteUserAccount)

module.exports = router
