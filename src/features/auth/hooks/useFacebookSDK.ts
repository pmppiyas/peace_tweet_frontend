'use client';

import { useCallback, useState } from 'react';
import { envConfig } from '@/config/env';

export function useFacebookSDK() {
  const [isLoading, setIsLoading] = useState(false);

  // Redirects user to Meta (Facebook) OAuth Dialog using centralized envConfig
  const redirectToFacebookOAuth = useCallback(() => {
    setIsLoading(true);
    const oauthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    oauthUrl.searchParams.set('client_id', envConfig.metaAppId);
    oauthUrl.searchParams.set('redirect_uri', envConfig.metaRedirectUri);
    oauthUrl.searchParams.set('scope', 'email,public_profile');
    oauthUrl.searchParams.set('response_type', 'code');

    window.location.href = oauthUrl.toString();
  }, []);

  return {
    isLoading,
    redirectToFacebookOAuth,
    facebookRedirectUri: envConfig.metaRedirectUri,
  };
}
