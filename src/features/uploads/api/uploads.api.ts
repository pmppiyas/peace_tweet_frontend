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
  let backendOrigin = siteConfig.apiUrl.replace(/\/api\/v1\/?$/, '');
  if (
    backendOrigin.includes('localhost') ||
    backendOrigin.includes('127.0.0.1')
  ) {
    backendOrigin = 'https://peace-tweet-backned.onrender.com';
  }
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

  // Upload multiple images in a single batch
  uploadMultipleImages: async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const { data } = await apiClient.post<ApiResponse<UploadImageResponse[]>>(
        '/uploads/images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (data?.data && Array.isArray(data.data)) {
        return data.data
          .map((item) => normalizeUploadUrl(item.url))
          .filter((url): url is string => Boolean(url));
      }
    } catch {
      // Fallback: parallel individual uploads if batch fails
    }

    const individualResults = await Promise.all(
      files.map(async (file) => {
        try {
          const res = await uploadsApi.uploadImage(file);
          return res.data?.url || null;
        } catch {
          return null;
        }
      }),
    );

    return individualResults.filter((url): url is string => Boolean(url));
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
