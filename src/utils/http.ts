import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// API 通用响应结构
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 自定义 axios 实例类型 - 拦截器返回 ApiResponse 而不是 AxiosResponse
interface HttpInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosInstance & HttpInstance

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data as any
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    } else if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    }
    return Promise.reject(error)
  }
)

export default http
