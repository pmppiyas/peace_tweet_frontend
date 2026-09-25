'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Mail, Lock, LogIn } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isLoggingIn } = useAuthActions();

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
        err?.response?.data?.message || 'Login failed. Please verify your credentials.';
      setErrorMessage(msg);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-xl">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
          <LogIn className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your saved bookmarks, personal feed, and profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" isLoading={isLoggingIn}>
            Sign In
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            Don't have an account?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Create Account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
