import { apiClient } from '@/lib/api/client';
import { siteConfig } from '@/config/site';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';

export interface UploadImageResponse {
  url: string;
  publicId: string;
}

const normalizeUploadUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendOrigin = siteConfig.apiUrl.replace(/\/api\/v1\/?$/, '');
  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const uploadsApi = {
  // Upload any image to Cloudinary or local storage fallback
  uploadImage: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<ApiResponse<UploadImageResponse>>(
      API_ENDPOINTS.UPLOADS.IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (data?.data?.url) {
      data.data.url = normalizeUploadUrl(data.data.url);
    }
    return data;
  },

  // Upload user avatar to Cloudinary or local storage fallback
  uploadAvatar: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<ApiResponse<UploadImageResponse>>(
      API_ENDPOINTS.UPLOADS.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (data?.data?.url) {
      data.data.url = normalizeUploadUrl(data.data.url);
    }
    return data;
  },
};
