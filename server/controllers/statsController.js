const File = require("../models/File")
const User = require("../models/User")

// Get system statistics (admin only)
exports.getSystemStats = async (req, res, next) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    // Count total users
    const totalUsers = await User.countDocuments()

    // Count total files
    const totalFiles = await File.countDocuments()

    // Calculate total storage used (in bytes)
    const files = await File.find().select("size")
    const totalStorage = files.reduce((total, file) => total + file.size, 0)

    // Get active users (users who have uploaded or downloaded files in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeFiles = await File.find({
      $or: [{ createdAt: { $gte: thirtyDaysAgo } }, { updatedAt: { $gte: thirtyDaysAgo } }],
    }).distinct("sender")

    const activeUsers = activeFiles.length

    // Get file type distribution
    const fileTypes = await File.aggregate([
      {
        $group: {
          _id: "$mimetype",
          count: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    res.status(200).json({
      totalUsers,
      totalFiles,
      totalStorage,
      activeUsers,
      fileTypes,
    })
  } catch (error) {
    next(error)
  }
}

// Get user activity statistics
exports.getUserActivity = async (req, res, next) => {
  try {
    // Get activity for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get daily upload counts
    const dailyUploads = await File.aggregate([
      {
        $match: {
          sender: req.userId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalSize: { $sum: "$size" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get daily download counts
    const dailyDownloads = await File.aggregate([
      {
        $match: {
          recipient: req.userId,
          downloaded: true,
          updatedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.status(200).json({
      dailyUploads,
      dailyDownloads,
    })
  } catch (error) {
    next(error)
  }
}
