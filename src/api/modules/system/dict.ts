import request from '@/utils/http'

export interface DictType {
  id: number
  dictName: string
  dictType: string
  status: string
  remark: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  timestamp: string
}

export const dictApi = {
  // 字典类型
  getDictTypes(params?: { page?: number; limit?: number; keyword?: string }) {
    return request.get<ApiResponse<DictType[]>>('/dict/types', { params })
  },

  getAllDictTypes() {
    return request.get('/dict/types/all')
  },

  getDictType(id: number) {
    return request.get(`/dict/types/${id}`)
  },

  createDictType(data: { dictName: string; dictType: string; status?: string; remark?: string }) {
    return request.post('/dict/types', data)
  },

  updateDictType(id: number, data: { dictName?: string; dictType?: string; status?: string; remark?: string }) {
    return request.put(`/dict/types/${id}`, data)
  },

  deleteDictType(id: number) {
    return request.delete(`/dict/types/${id}`)
  },

  // 字典数据
  getDictData(params?: { page?: number; limit?: number; dictType?: string; status?: string }) {
    return request.get('/dict/data', { params })
  },

  getDictDataByType(dictType: string) {
    return request.get(`/dict/data/type/${dictType}`)
  },

  getDictDataItem(id: number) {
    return request.get(`/dict/data/${id}`)
  },

  createDictData(data: {
    dictType: string
    dictLabel: string
    dictValue: string
    dictSort?: number
    isDefault?: string
    status?: string
    remark?: string
    cssClass?: string
    listClass?: string
  }) {
    return request.post('/dict/data', data)
  },

  updateDictData(id: number, data: {
    dictType?: string
    dictLabel?: string
    dictValue?: string
    dictSort?: number
    isDefault?: string
    status?: string
    remark?: string
    cssClass?: string
    listClass?: string
  }) {
    return request.put(`/dict/data/${id}`, data)
  },

  deleteDictData(id: number) {
    return request.delete(`/dict/data/${id}`)
  },

  batchDeleteDictData(ids: string) {
    return request.delete(`/dict/data/batch/${ids}`)
  },
}
