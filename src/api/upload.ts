import apiClient from './config'

export const uploadApi = {
  uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<{
      success: boolean
      data: {
        filename: string
        originalName: string
        mimetype: string
        size: number
        url: string
      }
    }>('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    return apiClient.post<{
      success: boolean
      data: {
        filename: string
        originalName: string
        url: string
        size: number
      }
    }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteFile(filename: string, folder: string = 'images') {
    return apiClient.delete<{ success: boolean; message: string }>(`/upload/file/${filename}`, {
      params: { folder },
    })
  },
}
