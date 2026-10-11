'use client';

import { useCallback, useState } from 'react';
import { envConfig } from '@/config/env';

export function useGoogleSDK() {
  const [isLoading, setIsLoading] = useState(false);

  const getRedirectUri = useCallback(() => {
    if (envConfig.googleRedirectUri) {
      return envConfig.googleRedirectUri;
    }
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/google/callback`;
    }
    return 'http://localhost:3000/auth/google/callback';
  }, []);

  const redirectToGoogleOAuth = useCallback(() => {
    setIsLoading(true);

    const clientId = envConfig.googleClientId;
    const redirectUri = getRedirectUri();

    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('access_type', 'offline');
    oauthUrl.searchParams.set('prompt', 'select_account');

    window.location.href = oauthUrl.toString();
  }, [getRedirectUri]);

  return {
    isLoading,
    redirectToGoogleOAuth,
    googleRedirectUri: getRedirectUri(),
  };
}
