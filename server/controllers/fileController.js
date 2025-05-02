const File = require("../models/File")
const User = require("../models/User")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const { v4: uuidv4 } = require("uuid")
const { encryptFile, decryptFile } = require("../utils/encryption")
const { validationResult } = require("express-validator")

// Upload a file
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const { recipientEmail } = req.body
    if (!recipientEmail) {
      return res.status(400).json({ message: "Recipient email is required" })
    }

    // Find recipient user
    const recipient = await User.findOne({ email: recipientEmail })
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }

    // Generate encryption key and IV
    const encryptionKey = crypto.randomBytes(32).toString("hex")
    const iv = crypto.randomBytes(16).toString("hex")

    // Encrypt the file
    const tempFilePath = req.file.path
    const encryptedFilename = `${uuidv4()}-${path.basename(req.file.originalname)}`
    const encryptedFilePath = path.join(__dirname, "../uploads", encryptedFilename)

    await encryptFile(tempFilePath, encryptedFilePath, encryptionKey, iv)

    // Delete the temp file
    fs.unlinkSync(tempFilePath)

    // Create file record in database
    const file = new File({
      filename: encryptedFilename,
      originalName: req.file.originalname,
      path: encryptedFilePath,
      size: req.file.size,
      mimetype: req.file.mimetype,
      sender: req.userId,
      senderEmail: req.userEmail,
      recipient: recipient._id,
      recipientEmail: recipientEmail,
      encryptionKey,
      iv,
    })

    await file.save()

    res.status(201).json({
      message: "File uploaded successfully",
      file: {
        id: file._id,
        filename: file.originalName,
        size: file.size,
        recipientEmail: file.recipientEmail,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Download a file
exports.downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.id

    // Find file in database
    const file = await File.findById(fileId)
    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    // Check if user is the recipient
    if (file.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    // Create temp file for decryption
    const tempFilePath = path.join(__dirname, "../temp", `temp-${uuidv4()}`)

    // Decrypt the file
    await decryptFile(file.path, tempFilePath, file.encryptionKey, file.iv)

    // Set file as downloaded
    file.downloaded = true
    await file.save()

    // Set headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`)
    res.setHeader("Content-Type", file.mimetype)

    // Stream the file to the response
    const fileStream = fs.createReadStream(tempFilePath)
    fileStream.pipe(res)

    // Delete temp file after sending
    fileStream.on("end", () => {
      fs.unlinkSync(tempFilePath)
    })
  } catch (error) {
    next(error)
  }
}

// Get sent files
exports.getSentFiles = async (req, res, next) => {
  try {
    const files = await File.find({ sender: req.userId })
      .sort({ createdAt: -1 })
      .select("_id filename originalName size recipientEmail createdAt downloaded")

    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
}

// Get received files
exports.getReceivedFiles = async (req, res, next) => {
  try {
    const files = await File.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .select("_id filename originalName size senderEmail createdAt downloaded")

    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
}

// Delete a file
exports.deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id

    // Find file in database
    const file = await File.findById(fileId)
    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    // Check if user is the sender
    if (file.sender.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    // Delete file from database
    await file.deleteOne()

    res.status(200).json({ message: "File deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Get file details
exports.getFileDetails = async (req, res, next) => {
  try {
    const fileId = req.params.id

    // Find file in database
    const file = await File.findById(fileId)
    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    // Check if user is the sender or recipient
    if (file.sender.toString() !== req.userId && file.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" })
    }

    // Return file details
    res.status(200).json({
      id: file._id,
      filename: file.originalName,
      size: file.size,
      mimetype: file.mimetype,
      senderEmail: file.senderEmail,
      recipientEmail: file.recipientEmail,
      createdAt: file.createdAt,
      downloaded: file.downloaded,
    })
  } catch (error) {
    next(error)
  }
}

// Search files
exports.searchFiles = async (req, res, next) => {
  try {
    const { query, type } = req.query

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    let files = []
    const searchRegex = new RegExp(query, "i")

    if (type === "sent" || !type) {
      const sentFiles = await File.find({
        sender: req.userId,
        $or: [{ originalName: searchRegex }, { recipientEmail: searchRegex }],
      })
        .sort({ createdAt: -1 })
        .select("_id filename originalName size recipientEmail createdAt downloaded")

      files = [...files, ...sentFiles.map((file) => ({ ...file.toObject(), type: "sent" }))]
    }

    if (type === "received" || !type) {
      const receivedFiles = await File.find({
        recipient: req.userId,
        $or: [{ originalName: searchRegex }, { senderEmail: searchRegex }],
      })
        .sort({ createdAt: -1 })
        .select("_id filename originalName size senderEmail createdAt downloaded")

      files = [...files, ...receivedFiles.map((file) => ({ ...file.toObject(), type: "received" }))]
    }

    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
}
