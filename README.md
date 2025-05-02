# Secure File Sharing Application

A full-stack secure file sharing application with end-to-end encryption, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register, login, logout)
- File upload with end-to-end encryption
- File download with decryption
- File management (list, delete)
- User profile management
- FTP server for alternative file transfer
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB
- **Security**: JWT authentication, AES-256-CBC encryption
- **File Transfer**: HTTP, FTP

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm run install:all
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

## Running the Application

Development mode:
\`\`\`
npm run dev
\`\`\`

This will start both the client (on port 3000) and server (on port 5000) concurrently.

Production mode:
\`\`\`
npm run build:client
npm start
\`\`\`

## Project Structure

\`\`\`
secure-file-sharing/
├── client/                 # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── ftp/                # FTP server configuration
└── .env                    # Environment variables
\`\`\`

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Security

- All passwords are hashed using bcrypt
- Authentication is handled with JWT tokens stored in HTTP-only cookies
- Files are encrypted using AES-256-CBC encryption
- All API endpoints that require authentication are protected with middleware

## License

This project is licensed under the MIT License.
\`\`\`

Now, let's create a .gitignore file:

```gitignore file=".gitignore"
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# server
server/uploads
server/temp
server/logs

# client
client/.next
client/out
