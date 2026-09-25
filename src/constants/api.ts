export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    ME: '/users/me',
    SAVED_DUAS: '/users/me/saved-duas',
  },
  DUAS: {
    LIST: '/duas',
    DETAIL: (id: string) => `/duas/${id}`,
    CREATE: '/duas',
    UPDATE: (id: string) => `/duas/${id}`,
    DELETE: (id: string) => `/duas/${id}`,
    SAVE: (id: string) => `/duas/${id}/save`,
    UNSAVE: (id: string) => `/duas/${id}/save`,
    REFERENCES: (id: string) => `/duas/${id}/references`,
    AUDIOS: (id: string) => `/duas/${id}/audios`,
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  SOURCES: {
    LIST: '/sources',
    DETAIL: (id: string) => `/sources/${id}`,
    CREATE: '/sources',
    UPDATE: (id: string) => `/sources/${id}`,
    DELETE: (id: string) => `/sources/${id}`,
  },
} as const;
