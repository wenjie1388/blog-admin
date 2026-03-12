import apiClient from '@/utils/http'

export interface Page {
  id: number
  title: string
  slug: string
  path: string
  status: 'draft' | 'published'
  description: string
  createdAt: string
  updatedAt: string
}

export interface PageListParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export const pageApi = {
  getList(params: PageListParams = {}) {
    return apiClient.get<{
      success: boolean
      data: Page[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/pages', { params })
  },

  getById(id: number) {
    return apiClient.get<{ success: boolean; data: Page }>(`/pages/${id}`)
  },

  getBySlug(slug: string) {
    return apiClient.get<{ success: boolean; data: Page }>(`/pages/slug/${slug}`)
  },

  create(data: Partial<Page>) {
    return apiClient.post<{ success: boolean; data: { id: number }; message: string }>('/pages', data)
  },

  update(id: number, data: Partial<Page>) {
    return apiClient.put<{ success: boolean; message: string }>(`/pages/${id}`, data)
  },

  delete(id: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/pages/${id}`)
  },
}
