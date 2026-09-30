// Centralized frontend environment configuration
export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'PeaceTweet',
  metaAppId: process.env.NEXT_PUBLIC_META_APP_ID || '',
  metaRedirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI || '',
} as const;
