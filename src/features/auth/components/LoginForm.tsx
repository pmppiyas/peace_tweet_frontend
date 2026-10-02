'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthActions } from '../hooks/useAuthActions';
import { useFacebookSDK } from '../hooks/useFacebookSDK';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Mail, Lock, LogIn } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isLoggingIn, isFacebookLoggingIn } = useAuthActions();
  const { redirectToFacebookOAuth, isLoading: isRedirectingFacebook } = useFacebookSDK();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please provide your email/username and password.');
      return;
    }

    try {
      await login({ identifier, password });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Login failed. Please verify your credentials.';
      setErrorMessage(msg);
    }
  };


  const handleFacebookLogin = () => {
    setErrorMessage('');
    redirectToFacebookOAuth();
  };

  const handleGoogleLogin = () => {
    setErrorMessage('Google login coming soon!');
  };

  return (
    <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-xl">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs">
          <LogIn className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your saved bookmarks, personal feed, and profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          <Input
            label="Email or Username"
            placeholder="admin@example.com or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <Button
            type="submit"
            className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
            isLoading={isLoggingIn}
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
          </div>

          {/* Social Login Buttons */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#3a3b3c] hover:bg-[#f0f2f5] dark:hover:bg-[#444546] transition-colors py-2.5 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-2xs"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isFacebookLoggingIn || isRedirectingFacebook}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1565c0] transition-colors py-2.5 px-4 text-sm font-semibold text-white shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFacebookLoggingIn || isRedirectingFacebook ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="h-4 w-4 shrink-0 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.793-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            )}
            {isFacebookLoggingIn || isRedirectingFacebook
              ? 'Connecting...'
              : 'Continue with Facebook'}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-primary-500 hover:underline dark:text-primary-400"
            >
              Create Account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
