const API_URL = process.env.API_URL || "http://localhost:5000"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  // Default options
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "An error occurred")
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    fetchAPI("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    fetchAPI("/api/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () => fetchAPI("/api/auth/me"),
}

// Files API
export const filesAPI = {
  uploadFile: (formData: FormData) =>
    fetch(`${API_URL}/api/files/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Upload failed")
      }
      return response.json()
    }),

  getSentFiles: () => fetchAPI("/api/files/sent"),

  getReceivedFiles: () => fetchAPI("/api/files/received"),

  downloadFile: (fileId: string) =>
    fetch(`${API_URL}/api/files/download/${fileId}`, {
      credentials: "include",
    }),

  deleteFile: (fileId: string) =>
    fetchAPI(`/api/files/${fileId}`, {
      method: "DELETE",
    }),

  getFileDetails: (fileId: string) => fetchAPI(`/api/files/${fileId}`),

  searchFiles: (query: string, type?: string) =>
    fetchAPI(`/api/files/search?query=${query}${type ? `&type=${type}` : ""}`),
}

// User API
export const userAPI = {
  getProfile: () => fetchAPI("/api/users/profile"),

  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) =>
    fetchAPI("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getStats: () => fetchAPI("/api/users/stats"),

  deleteAccount: (password: string) =>
    fetchAPI("/api/users/account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
}

// Stats API
export const statsAPI = {
  getUserActivity: () => fetchAPI("/api/stats/activity"),
}
