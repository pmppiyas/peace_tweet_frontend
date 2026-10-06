// Helper to normalize and ensure API URL ends with /api/v1
const normalizeApiUrl = (url?: string): string => {
  if (!url) return '';
  const clean = url.trim().replace(/\/+$/, '');
  if (!clean) return '';
  // If the URL already ends with /api/v1, use it
  if (clean.endsWith('/api/v1')) {
    return clean;
  }
  // If the user provided the domain without /api/v1 (e.g. https://peace-tweet-backned.onrender.com)
  return `${clean}/api/v1`;
};

// Centralized frontend environment configuration
export const envConfig = {
  apiUrl: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, ''),
  appName: process.env.NEXT_PUBLIC_APP_NAME || '',
  metaAppId: process.env.NEXT_PUBLIC_META_APP_ID || '',
  metaRedirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI || '',
} as const;
