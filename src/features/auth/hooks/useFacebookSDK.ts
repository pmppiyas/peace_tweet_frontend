'use client';

import { useCallback, useState } from 'react';

const FACEBOOK_APP_ID =
  process.env.NEXT_PUBLIC_META_APP_ID ||
  process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ||
  '2786289915123306';

const FACEBOOK_REDIRECT_URI =
  process.env.NEXT_PUBLIC_META_REDIRECT_URI ||
  'http://localhost:3000/auth/facebook/callback';

export function useFacebookSDK() {
  const [isLoading, setIsLoading] = useState(false);

  // Redirects user to Facebook OAuth Dialog which returns ?code= to /auth/facebook/callback
  const redirectToFacebookOAuth = useCallback(() => {
    setIsLoading(true);
    const oauthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    oauthUrl.searchParams.set('client_id', FACEBOOK_APP_ID);
    oauthUrl.searchParams.set('redirect_uri', FACEBOOK_REDIRECT_URI);
    oauthUrl.searchParams.set('scope', 'email,public_profile');
    oauthUrl.searchParams.set('response_type', 'code');

    window.location.href = oauthUrl.toString();
  }, []);

  return {
    isLoading,
    redirectToFacebookOAuth,
    facebookRedirectUri: FACEBOOK_REDIRECT_URI,
  };
}
