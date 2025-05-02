const express = require("express")
const fileController = require("../controllers/fileController")
const { auth } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Upload file route
router.post("/upload", auth, upload.single("file"), fileController.uploadFile)

// Download file route
router.get("/download/:id", auth, fileController.downloadFile)

// Get sent files route
router.get("/sent", auth, fileController.getSentFiles)

// Get received files route
router.get("/received", auth, fileController.getReceivedFiles)

// Get file details route
router.get("/:id", auth, fileController.getFileDetails)

// Delete file route
router.delete("/:id", auth, fileController.deleteFile)

// Search files route
router.get("/search", auth, fileController.searchFiles)

module.exports = router
