import apiClient from '@/utils/http'

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  sortOrder: number
  articleCount: number
  createdAt: string
  updatedAt: string
}

export const categoryApi = {
  getAll() {
    return apiClient.get<{ success: boolean; data: Category[] }>('/categories')
  },

  getById(id: number) {
    return apiClient.get<{ success: boolean; data: Category }>(`/categories/${id}`)
  },

  create(data: Partial<Category>) {
    return apiClient.post<{ success: boolean; data: { id: number }; message: string }>('/categories', data)
  },

  update(id: number, data: Partial<Category>) {
    return apiClient.put<{ success: boolean; message: string }>(`/categories/${id}`, data)
  },

  delete(id: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/categories/${id}`)
  },
}
