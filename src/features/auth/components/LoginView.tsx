'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthActions } from '../hooks/useAuthActions';
import { useFacebookSDK } from '../hooks/useFacebookSDK';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function LoginView() {
  const { locale } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isLoggingIn, isFacebookLoggingIn } = useAuthActions();
  const { redirectToFacebookOAuth, isLoading: isRedirectingFacebook } = useFacebookSDK();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(
        locale === 'bn'
          ? 'অনুগ্রহ করে আপনার ইমেইল/ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।'
          : 'Please provide your email/username and password.',
      );
      return;
    }

    try {
      await login({ identifier, password });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করে পুনরায় চেষ্টা করুন।'
          : 'Login failed. Please verify your credentials.');
      setErrorMessage(msg);
    }
  };

  const handleFacebookLogin = () => {
    setErrorMessage('');
    redirectToFacebookOAuth();
  };

  const handleGoogleLogin = () => {
    setErrorMessage(
      locale === 'bn'
        ? 'গুগল লগইন শীঘ্রই আসছে!'
        : 'Google login coming soon!',
    );
  };

  return (
    <div className="h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] w-full overflow-hidden flex items-center justify-center bg-[#f0f2f5] dark:bg-[#18191a] px-4 sm:px-8 xl:px-14">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-16 items-center">
        {/* ================= LEFT SIDE: Minimalist & Iconic Brand ================= */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center pr-4 xl:pr-12 select-none">
          <h1 className="text-5xl xl:text-6xl font-black tracking-tight text-primary-600 dark:text-primary-400 mb-3">
            PeaceTweet
          </h1>
          <p className="text-2xl xl:text-[28px] font-normal text-[#1c1e21] dark:text-[#e4e6eb] leading-snug max-w-lg">
            {locale === 'bn'
              ? 'PeaceTweet আপনাকে অর্থপূর্ণ, আত্মশুদ্ধিকর ও পবিত্র ইসলামিক ভাবগাম্ভীর্যপূর্ণ পরিবেশে সবার সাথে যুক্ত রাখে।'
              : 'PeaceTweet helps you connect with peaceful hearts and practice daily authentic duas.'}
          </p>
        </div>

        {/* ================= RIGHT SIDE: Facebook-style Modern Login Card ================= */}
        <div className="w-full lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
          {/* Mobile-only Compact Header (No duplicate logo or brand name) */}
          <div className="lg:hidden text-center mb-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#1c1e21] dark:text-[#e4e6eb]">
              {locale === 'bn'
                ? 'আপনার অ্যাকাউন্টে লগইন করুন'
                : 'Sign in to your account'}
            </h2>
          </div>

          {/* Main Card */}
          <div className="w-full max-w-[380px] xl:max-w-[400px] rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xl p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {errorMessage && (
                <div className="rounded-xl bg-red-50 p-2 text-xs text-red-600 font-semibold border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Identifier Input */}
              <Input
                label={locale === 'bn' ? 'ইমেইল বা ইউজারনেম' : 'Email or Username'}
                placeholder={
                  locale === 'bn'
                    ? 'আপনার ইমেইল বা ইউজারনেম'
                    : 'email@example.com or username'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              {/* Password Input with Show/Hide toggle */}
              <div className="relative">
                <Input
                  label={locale === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-0.5">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2 shadow-sm"
                  isLoading={isLoggingIn}
                >
                  {locale === 'bn' ? 'লগইন করুন' : 'Log In'}
                </Button>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2 pt-0.5">
                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isFacebookLoggingIn || isRedirectingFacebook}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#1565c0] transition-colors py-2 px-3 text-xs sm:text-sm font-bold text-white shadow-2xs disabled:opacity-60 cursor-pointer"
                >
                  {isFacebookLoggingIn || isRedirectingFacebook ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.793-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                  )}
                  <span>
                    {isFacebookLoggingIn || isRedirectingFacebook
                      ? locale === 'bn'
                        ? 'সংযুক্ত হচ্ছে...'
                        : 'Connecting...'
                      : locale === 'bn'
                      ? 'Facebook দিয়ে লগইন'
                      : 'Continue with Facebook'}
                  </span>
                </button>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#3a3b3c] hover:bg-[#f0f2f5] dark:hover:bg-[#444546] transition-colors py-2 px-3 text-xs sm:text-sm font-semibold text-[#050505] dark:text-gray-200 shadow-2xs cursor-pointer"
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
                  <span>
                    {locale === 'bn'
                      ? 'Google দিয়ে লগইন'
                      : 'Continue with Google'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-0.5">
                <div className="flex-1 h-px bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
                <span className="text-xs text-[#65676b] dark:text-[#b0b3b8] font-medium">
                  {locale === 'bn' ? 'বা' : 'or'}
                </span>
                <div className="flex-1 h-px bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
              </div>

              {/* Create New Account Button (Facebook-style Green button) */}
              <div className="pt-0.5 text-center">
                <Link
                  href={ROUTES.REGISTER}
                  className="inline-block w-full py-2 px-4 rounded-xl bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-xs sm:text-sm text-center shadow-xs transition-colors cursor-pointer"
                >
                  {locale === 'bn'
                    ? 'নতুন অ্যাকাউন্ট তৈরি করুন'
                    : 'Create New Account'}
                </Link>
              </div>
            </form>
          </div>

          {/* Subtext below card */}
          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] text-center mt-2 select-none">
            {locale === 'bn'
              ? 'PeaceTweet — বিশুদ্ধ দোয়া ও পবিত্র সোশ্যাল প্ল্যাটফর্ম'
              : 'PeaceTweet — A Peaceful Islamic Social Platform'}
          </p>
        </div>
      </div>
    </div>
  );
}
