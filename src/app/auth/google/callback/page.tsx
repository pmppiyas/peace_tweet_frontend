'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useGoogleSDK } from '@/features/auth/hooks/useGoogleSDK';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const { googleLogin } = useAuthActions();
  const { googleRedirectUri } = useGoogleSDK();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMsg(errorDescription || 'Google sign-in was cancelled or denied.');
      return;
    }

    if (!code) {
      setErrorMsg('No authorization code received from Google.');
      return;
    }

    googleLogin({ code, redirectUri: googleRedirectUri }).catch((err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to complete Google authentication.';
      setErrorMsg(msg);
    });
  }, [searchParams, googleLogin, googleRedirectUri]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-bold">
            {errorMsg ? 'Google Sign-In Failed' : 'Signing in with Google...'}
          </CardTitle>
          <CardDescription>
            {errorMsg
              ? 'We could not complete your Google authentication.'
              : 'Please wait while we verify your Google account.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {!errorMsg ? (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#4285F4]/30 border-t-[#4285F4]" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Redirecting to your feed...
              </p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300 text-center">
                {errorMsg}
              </div>
              <Link href={ROUTES.LOGIN} className="block w-full">
                <Button className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#4285F4]/30 border-t-[#4285F4]" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
