const fs = require("fs")
const path = require("path")

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs")
fs.mkdirSync(logsDir, { recursive: true })

// Create log file streams
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), { flags: "a" })
const errorLogStream = fs.createWriteStream(path.join(logsDir, "error.log"), { flags: "a" })

// Format date for logs
const formatDate = () => {
  const now = new Date()
  return `${now.toISOString()}`
}

// Log levels
const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
}

// Logger function
const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      timestamp: formatDate(),
      level: LOG_LEVELS.INFO,
      message,
      ...meta,
    }
    accessLogStream.write(JSON.stringify(logEntry) + "\n")
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message}`)
    }
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      timestamp: formatDate(),
      level: LOG_LEVELS.WARN,
      message,
      ...meta,
    }
    accessLogStream.write(JSON.stringify(logEntry) + "\n")
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message}`)
    }
  },

  error: (message, error = null, meta = {}) => {
    const logEntry = {
      timestamp: formatDate(),
      level: LOG_LEVELS.ERROR,
      message,
      error: error ? { message: error.message, stack: error.stack } : null,
      ...meta,
    }
    errorLogStream.write(JSON.stringify(logEntry) + "\n")
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message}`)
      if (error) {
        console.error(error)
      }
    }
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== "production") {
      const logEntry = {
        timestamp: formatDate(),
        level: LOG_LEVELS.DEBUG,
        message,
        ...meta,
      }
      console.debug(`[${logEntry.timestamp}] [${logEntry.level}] ${logEntry.message}`)
    }
  },

  // Log HTTP request
  logRequest: (req, res, next) => {
    const startTime = Date.now()

    // Log when the response is finished
    res.on("finish", () => {
      const duration = Date.now() - startTime
      const logEntry = {
        timestamp: formatDate(),
        level: LOG_LEVELS.INFO,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      }

      accessLogStream.write(JSON.stringify(logEntry) + "\n")

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} ${logEntry.status} ${logEntry.duration}`,
        )
      }
    })

    next()
  },
}

module.exports = logger
