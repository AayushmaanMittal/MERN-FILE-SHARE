const jwt = require("jsonwebtoken")

exports.auth = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user info to request
    req.userId = decoded.userId
    req.userEmail = decoded.email

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
