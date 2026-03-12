import apiClient from  '@/utils/http'

export interface Theme {
  id: number
  name: string
  key: string
  description: string | null
  config: {
    primaryColor?: string
    backgroundColor?: string
    accentColor?: string
  } | null
  isDefault: number
  createdAt: string
  updatedAt: string
}

export const themeApi = {
  getAll() {
    return apiClient.get<{ success: boolean; data: Theme[] }>('/themes')
  },

  getById(id: number) {
    return apiClient.get<{ success: boolean; data: Theme }>(`/themes/${id}`)
  },

  create(data: Partial<Theme>) {
    return apiClient.post<{ success: boolean; data: { id: number }; message: string }>('/themes', data)
  },

  update(id: number, data: Partial<Theme>) {
    return apiClient.put<{ success: boolean; message: string }>(`/themes/${id}`, data)
  },

  delete(id: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/themes/${id}`)
  },

  setDefault(id: number) {
    return apiClient.put<{ success: boolean; message: string }>(`/themes/${id}/default`)
  },
}
