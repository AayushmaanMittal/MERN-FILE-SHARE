const FtpSrv = require("ftp-srv")
const path = require("path")
const fs = require("fs")
const User = require("../models/User")
const File = require("../models/File")
const { encryptFile, decryptFile } = require("../utils/encryption")
const crypto = require("crypto")
const { v4: uuidv4 } = require("uuid")

// Create FTP server
const ftpServer = new FtpSrv({
  url: `ftp://0.0.0.0:${process.env.FTP_PORT || 21}`,
  pasv_url: process.env.PASV_URL || "127.0.0.1",
  pasv_min: 1024,
  pasv_max: 1048,
  anonymous: false,
  blacklist: ["RMD", "RNFR", "RNTO"],
})

// Setup FTP server hooks
ftpServer.on("login", async ({ username, password }, resolve, reject) => {
  try {
    // Find user by email (username)
    const user = await User.findOne({ email: username })
    if (!user) {
      return reject(new Error("Invalid credentials"))
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return reject(new Error("Invalid credentials"))
    }

    // Create user-specific directories
    const userUploadsDir = path.join(__dirname, "../uploads", user._id.toString())
    const userDownloadsDir = path.join(__dirname, "../downloads", user._id.toString())

    fs.mkdirSync(userUploadsDir, { recursive: true })
    fs.mkdirSync(userDownloadsDir, { recursive: true })

    // Setup user's FTP session
    return resolve({
      root: userUploadsDir,
      cwd: "/",
      fs: {
        mkdir: async (fsPath) => {
          const fullPath = path.join(userUploadsDir, fsPath)
          fs.mkdirSync(fullPath, { recursive: true })
          return fsPath
        },
        write: async (fsPath, readStream) => {
          // Handle file upload
          const filename = path.basename(fsPath)
          const tempPath = path.join(__dirname, "../temp", `temp-${uuidv4()}`)
          const writeStream = fs.createWriteStream(tempPath)

          // Save the file to temp location
          await new Promise((resolve, reject) => {
            readStream.pipe(writeStream)
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
          })

          // Get file stats
          const stats = fs.statSync(tempPath)

          // Generate encryption key and IV
          const encryptionKey = crypto.randomBytes(32).toString("hex")
          const iv = crypto.randomBytes(16).toString("hex")

          // Encrypt the file
          const encryptedFilename = `${uuidv4()}-${filename}`
          const encryptedFilePath = path.join(__dirname, "../uploads", encryptedFilename)

          await encryptFile(tempPath, encryptedFilePath, encryptionKey, iv)

          // Delete the temp file
          fs.unlinkSync(tempPath)

          // Create file record in database
          const file = new File({
            filename: encryptedFilename,
            originalName: filename,
            path: encryptedFilePath,
            size: stats.size,
            mimetype: "application/octet-stream", // Default mimetype
            sender: user._id,
            senderEmail: user.email,
            recipientEmail: path.dirname(fsPath).replace(/^\//, ""), // Use directory name as recipient email
            encryptionKey,
            iv,
          })

          // Find recipient user
          const recipient = await User.findOne({ email: file.recipientEmail })
          if (recipient) {
            file.recipient = recipient._id
          }

          await file.save()

          return fsPath
        },
        read: async (fsPath, writeStream) => {
          // Handle file download
          try {
            // Extract file ID from path
            const fileId = path.basename(fsPath, path.extname(fsPath))

            // Find file in database
            const file = await File.findById(fileId)
            if (!file) {
              throw new Error("File not found")
            }

            // Check if user is the recipient
            if (file.recipient && file.recipient.toString() !== user._id.toString()) {
              throw new Error("Unauthorized access")
            }

            // Create temp file for decryption
            const tempFilePath = path.join(__dirname, "../temp", `temp-${uuidv4()}`)

            // Decrypt the file
            await decryptFile(file.path, tempFilePath, file.encryptionKey, file.iv)

            // Stream the file to the client
            const readStream = fs.createReadStream(tempFilePath)

            // Set file as downloaded
            file.downloaded = true
            await file.save()

            // Pipe the decrypted file to the FTP client
            readStream.pipe(writeStream)

            // Delete temp file after sending
            readStream.on("end", () => {
              fs.unlinkSync(tempFilePath)
            })
          } catch (error) {
            console.error("FTP read error:", error)
            writeStream.end()
          }
        },
        list: async (fsPath) => {
          // List files available for download
          try {
            // If in root directory, list received files
            if (fsPath === "/" || fsPath === "") {
              const files = await File.find({ recipient: user._id })

              return files.map((file) => ({
                name: `${file._id}${path.extname(file.originalName)}`,
                size: file.size,
                isDirectory: false,
                mtime: file.createdAt,
              }))
            }

            return []
          } catch (error) {
            console.error("FTP list error:", error)
            return []
          }
        },
      },
    })
  } catch (error) {
    console.error("FTP login error:", error)
    return reject(error)
  }
})

ftpServer.on("server-error", (error) => {
  console.error("FTP server error:", error)
})

module.exports = ftpServer
