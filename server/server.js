const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const path = require("path")
const ftpServer = require("./ftp/ftpServer")
const authRoutes = require("./routes/auth")
const fileRoutes = require("./routes/files")
const userRoutes = require("./routes/users")
const statsRoutes = require("./routes/stats")
const setupSwagger = require("./api-docs")
const { errorHandler } = require("./middleware/errorHandler")
const logger = require("./utils/logger")
const { apiLimiter, authLimiter, uploadLimiter } = require("./middleware/rate-limiter")

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") })

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Logging middleware
app.use(logger.logRequest)

// Create directories if they don't exist
const uploadsDir = path.join(__dirname, "uploads")
const tempDir = path.join(__dirname, "temp")
require("fs").mkdirSync(uploadsDir, { recursive: true })
require("fs").mkdirSync(tempDir, { recursive: true })

// Setup API documentation
setupSwagger(app)

// Apply rate limiting
// app.use("/api/", apiLimiter)
// app.use("/api/auth/", authLimiter)
// app.use("/api/files/upload", uploadLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/users", userRoutes)
app.use("/api/stats", statsRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB")

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`)
    })

    // Start FTP server
    ftpServer.listen()
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err)
    process.exit(1)
  })
