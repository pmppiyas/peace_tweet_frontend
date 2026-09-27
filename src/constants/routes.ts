export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DUAS: {
    HOME: '/duas',
    DETAIL: (id: string) => `/duas/${id}`,
  },
  CATEGORIES: {
    HOME: '/categories',
    DETAIL: (slug: string) => `/categories/${slug}`,
  },
  SEARCH: '/search',
  SAVED: '/saved',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  USERS: {
    PROFILE: (username: string) => `/users/${username}`,
  },
  FRIENDS: {
    HOME: '/friends',
    REQUESTS: '/friends/requests',
    LIST: '/friends/list',
    SENT: '/friends/sent',
  },
  ADMIN: {
    HOME: '/admin',
    DUAS: '/admin/duas',
    CATEGORIES: '/admin/categories',
    SOURCES: '/admin/sources',
  },

  LOGIN: '/login',
  REGISTER: '/register',
  DUA_DETAIL: (id: string) => `/duas/${id}`,
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  USER_PROFILE: (username: string) => `/users/${username}`,
} as const;
