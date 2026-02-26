import apiClient from './config'

export interface DashboardStats {
  articles: {
    total: number
    published: number
    draft: number
    archived: number
  }
  views: {
    total: number
  }
  categories: {
    total: number
  }
  users: {
    total: number
    active: number
    disabled: number
  }
  recentArticles: Array<{
    id: number
    title: string
    status: string
    viewCount: number
    createdAt: string
    categoryName: string
  }>
  popularArticles: Array<{
    id: number
    title: string
    viewCount: number
    createdAt: string
    categoryName: string
  }>
}

export const statsApi = {
  getDashboard() {
    return apiClient.get<{ success: boolean; data: DashboardStats }>('/stats/dashboard')
  },

  getArticleTrend(days: number = 30) {
    return apiClient.get<{ success: boolean; data: Array<{ date: string; count: number }> }>('/stats/article-trend', {
      params: { days },
    })
  },

  getCategoryDistribution() {
    return apiClient.get<{ success: boolean; data: Array<{ name: string; count: number }> }>('/stats/category-distribution')
  },
}
