'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useFacebookSDK } from '@/features/auth/hooks/useFacebookSDK';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

function FacebookCallbackContent() {
  const searchParams = useSearchParams();
  const { facebookLogin } = useAuthActions();
  const { facebookRedirectUri } = useFacebookSDK();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMsg(errorDescription || 'Facebook login was cancelled or denied.');
      return;
    }

    if (!code) {
      setErrorMsg('No authorization code received from Facebook.');
      return;
    }

    facebookLogin({ code, redirectUri: facebookRedirectUri }).catch((err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to complete Facebook authentication.';
      setErrorMsg(msg);
    });
  }, [searchParams, facebookLogin, facebookRedirectUri]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs">
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.793-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
          <CardTitle className="text-xl font-bold">
            {errorMsg ? 'Facebook Sign-In Failed' : 'Signing in with Facebook...'}
          </CardTitle>
          <CardDescription>
            {errorMsg
              ? 'We could not complete your Facebook authentication.'
              : 'Please wait while we verify your Facebook account.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {!errorMsg ? (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#1877F2]/30 border-t-[#1877F2]" />
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

export default function FacebookCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#1877F2]/30 border-t-[#1877F2]" />
        </div>
      }
    >
      <FacebookCallbackContent />
    </Suspense>
  );
}
