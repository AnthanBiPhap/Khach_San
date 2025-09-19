import axios from "axios"

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Generic API functions
export const apiGet = async (url: string): Promise<any> => {
  const response = await api.get(url)
  return response.data
}

export const apiPost = async (url: string, data?: any): Promise<any> => {
  const response = await api.post(url, data)
  return response.data
}

export const apiPut = async (url: string, data?: any): Promise<any> => {
  const response = await api.put(url, data)
  return response.data
}

export const apiDelete = async (url: string): Promise<any> => {
  const response = await api.delete(url)
  return response.data
}
