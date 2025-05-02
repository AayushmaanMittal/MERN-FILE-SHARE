const express = require("express")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Secure File Sharing API",
      version: "1.0.0",
      description: "API documentation for the secure file sharing application",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./api-docs.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication endpoints
 *   - name: Files
 *     description: File management endpoints
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - recipientEmail
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid input or missing file
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/files/download/{id}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/files/sent:
 *   get:
 *     summary: Get list of sent files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of sent files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   filename:
 *                     type: string
 *                   originalName:
 *                     type: string
 *                   size:
 *                     type: number
 *                   recipientEmail:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   downloaded:
 *                     type: boolean
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/files/received:
 *   get:
 *     summary: Get list of received files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of received files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   filename:
 *                     type: string
 *                   originalName:
 *                     type: string
 *                   size:
 *                     type: number
 *                   senderEmail:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   downloaded:
 *                     type: boolean
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated or invalid password
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSent:
 *                   type: number
 *                 totalReceived:
 *                   type: number
 *                 totalStorage:
 *                   type: number
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 */

// Setup Swagger middleware
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

module.exports = setupSwagger
