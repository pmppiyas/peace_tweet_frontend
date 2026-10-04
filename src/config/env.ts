// Centralized frontend environment configuration
export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
  appName: process.env.NEXT_PUBLIC_APP_NAME || '',
  metaAppId: process.env.NEXT_PUBLIC_META_APP_ID || '',
  metaRedirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI || '',
} as const;
