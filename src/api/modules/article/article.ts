import apiClient from  '@/utils/http'

export interface Article {
  id: number
  title: string
  content: string
  excerpt: string
  coverImage: string | null
  categoryId: number | null
  tags: string | null
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  createdAt: string
  updatedAt: string
  categoryName?: string
  authorName?: string
}

export interface ArticleListParams {
  page?: number
  limit?: number
  categoryId?: number
  status?: string
  search?: string
}

export const articleApi = {
  getList(params: ArticleListParams = {}) {
    return apiClient.get<{
      success: boolean
      data: Article[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/articles', { params })
  },

  getById(id: number) {
    return apiClient.get<{ success: boolean; data: Article }>(`/articles/${id}`)
  },

  create(data: Partial<Article>) {
    return apiClient.post<{ success: boolean; data: { id: number }; message: string }>('/articles', data)
  },

  update(id: number, data: Partial<Article>) {
    return apiClient.put<{ success: boolean; message: string }>(`/articles/${id}`, data)
  },

  delete(id: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/articles/${id}`)
  },
}
