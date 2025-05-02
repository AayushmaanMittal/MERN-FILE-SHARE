const express = require("express")
const statsController = require("../controllers/statsController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get system statistics route (admin only)
router.get("/system", auth, statsController.getSystemStats)

// Get user activity statistics route
router.get("/activity", auth, statsController.getUserActivity)

module.exports = router
