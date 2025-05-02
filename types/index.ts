// User types
export interface User {
  id: string
  name: string
  email: string
}

export interface UserProfile extends User {
  createdAt: string
}

// File types
export interface FileItem {
  _id: string
  filename: string
  originalName: string
  size: number
  senderEmail?: string
  recipientEmail?: string
  createdAt: string
  downloaded: boolean
}

export interface FileStats {
  totalSent: number
  totalReceived: number
  totalStorage: number
  recentActivity: FileItem[]
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface AuthResponse {
  message: string
  user: User
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
