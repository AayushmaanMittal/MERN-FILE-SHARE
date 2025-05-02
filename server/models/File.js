const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  encryptionKey: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  downloaded: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // Auto-delete after 7 days
  },
})

const File = mongoose.model("File", fileSchema)

module.exports = File
