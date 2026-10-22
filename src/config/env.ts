export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || '',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, ''),
  appName: process.env.NEXT_PUBLIC_APP_NAME || '',
  metaAppId: process.env.NEXT_PUBLIC_META_APP_ID || '',
  metaRedirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI || '',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  googleRedirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '',
} as const;
