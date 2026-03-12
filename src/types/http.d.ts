import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// API 通用响应结构
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 扩展 Axios 类型，让拦截器返回的数据类型正确
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>
    post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
    put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
    delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>
    patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
  }
}
