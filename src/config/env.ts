// Helper to normalize and ensure API URL ends with /api/v1
const normalizeApiUrl = (url?: string): string => {
  let clean = (url || '').trim().replace(/\/+$/, '');

  // Guard against localhost on live production domain (e.g. peacetweet.vercel.app)
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (
      !isLocalhost &&
      (!clean || clean.includes('localhost') || clean.includes('127.0.0.1'))
    ) {
      clean = 'https://peace-tweet-backned.onrender.com';
    }
  }

  if (!clean) return '';
  clean = clean.replace('peace-tweet-backend', 'peace-tweet-backned');
  if (clean.endsWith('/api/v1')) {
    return clean;
  }
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
