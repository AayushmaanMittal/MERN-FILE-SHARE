const crypto = require("crypto")
const fs = require("fs")
const { promisify } = require("util")
const pipeline = promisify(require("stream").pipeline)

// Encrypt file
exports.encryptFile = async (inputPath, outputPath, key, iv) => {
  // Convert hex strings to buffers
  const keyBuffer = Buffer.from(key, "hex")
  const ivBuffer = Buffer.from(iv, "hex")

  const readStream = fs.createReadStream(inputPath)
  const writeStream = fs.createWriteStream(outputPath)
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, ivBuffer)

  await pipeline(readStream, cipher, writeStream)
}

// Decrypt file
exports.decryptFile = async (inputPath, outputPath, key, iv) => {
  // Convert hex strings to buffers
  const keyBuffer = Buffer.from(key, "hex")
  const ivBuffer = Buffer.from(iv, "hex")

  const readStream = fs.createReadStream(inputPath)
  const writeStream = fs.createWriteStream(outputPath)
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, ivBuffer)

  await pipeline(readStream, decipher, writeStream)
}
