# Secure File Sharing API

This is the backend API for the Secure File Sharing application. It provides endpoints for user authentication, file management, and user profile management.

## Features

- User authentication (register, login, logout)
- File upload with end-to-end encryption
- File download with decryption
- File management (list, delete)
- User profile management
- FTP server for alternative file transfer
- API documentation with Swagger

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Create a `.env` file in the root directory with the following variables:
   \`\`\`
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/file-sharing
   JWT_SECRET=your_jwt_secret_key_here
   FTP_PORT=21
   PASV_URL=127.0.0.1
   \`\`\`

### Running the Server

Development mode:
\`\`\`
npm run dev
\`\`\`

Production mode:
\`\`\`
npm start
\`\`\`

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user information

### Files

- `POST /api/files/upload` - Upload a file
- `GET /api/files/download/:id` - Download a file
- `GET /api/files/sent` - Get list of sent files
- `GET /api/files/received` - Get list of received files
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete a file
- `GET /api/files/search` - Search files

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

## Security

- All passwords are hashed using bcrypt
- Authentication is handled with JWT tokens stored in HTTP-only cookies
- Files are encrypted using AES-256-CBC encryption
- All API endpoints that require authentication are protected with middleware
- CORS is configured to only allow requests from the client domain

## FTP Server

The application also includes an FTP server for alternative file transfer:

- Authentication uses the same credentials as the web application
- Files uploaded via FTP are automatically encrypted
- Files downloaded via FTP are automatically decrypted
- Each user has their own isolated directory

## Error Handling

The API includes comprehensive error handling:

- Validation errors for invalid input
- Authentication errors for unauthorized access
- Not found errors for missing resources
- Server errors with appropriate status codes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

\`\`\`

Let me complete the API section for the server with a few more important files:
