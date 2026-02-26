import apiClient from './config'

export interface LoginData {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  avatar: string | null
  nickname: string | null
}

export const authApi = {
  login(data: LoginData) {
    return apiClient.post<{ success: boolean; data: { token: string; user: User }; message: string }>('/auth/login', data)
  },

  getMe() {
    return apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me')
  },

  changePassword(oldPassword: string, newPassword: string) {
    return apiClient.post<{ success: boolean; message: string }>('/auth/change-password', {
      oldPassword,
      newPassword,
    })
  },
}
