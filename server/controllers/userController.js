const User = require("../models/User")
const File = require("../models/File")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, currentPassword, newPassword } = req.body

    // Find user
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update name if provided
    if (name) {
      user.name = name
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" })
      }

      // Set new password
      user.password = newPassword
    }

    await user.save()

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    // Count sent files
    const sentFiles = await File.find({ sender: req.userId })
    const totalSent = sentFiles.length

    // Count received files
    const receivedFiles = await File.find({ recipient: req.userId })
    const totalReceived = receivedFiles.length

    // Calculate total storage used (in bytes)
    const totalStorage = sentFiles.reduce((total, file) => total + file.size, 0)

    // Get recent activity (last 10 files sent or received)
    const recentActivity = await File.find({
      $or: [{ sender: req.userId }, { recipient: req.userId }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id filename originalName size senderEmail recipientEmail createdAt downloaded")

    res.status(200).json({
      totalSent,
      totalReceived,
      totalStorage,
      recentActivity,
    })
  } catch (error) {
    next(error)
  }
}

// Delete user account
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const { password } = req.body

    // Find user
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" })
    }

    // Delete all files sent by user
    const sentFiles = await File.find({ sender: req.userId })
    for (const file of sentFiles) {
      // Delete file from filesystem
      if (require("fs").existsSync(file.path)) {
        require("fs").unlinkSync(file.path)
      }
      await file.deleteOne()
    }

    // Delete user
    await user.deleteOne()

    // Clear auth cookie
    res.clearCookie("token")

    res.status(200).json({ message: "Account deleted successfully" })
  } catch (error) {
    next(error)
  }
}
