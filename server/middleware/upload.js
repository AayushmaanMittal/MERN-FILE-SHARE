const multer = require("multer")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../temp"))
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "application/zip",
    "application/x-zip-compressed",
    "text/plain",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("File type not supported"), false)
  }
}

// File size limit (100MB)
const limits = {
  fileSize: 100 * 1024 * 1024,
}

// Export multer middleware
exports.upload = multer({
  storage,
  fileFilter,
  limits,
})
