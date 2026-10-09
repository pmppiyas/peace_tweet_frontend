'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { usersApi } from '../api/users.api';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function SecuritySettingsCard() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const hasPassword = Boolean(user?.hasPassword) && !user?.needPasswordUpdate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (hasPassword && !currentPassword) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'অনুগ্রহ করে বর্তমান পাসওয়ার্ড দিন।'
            : 'Please enter your current password.',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।'
            : 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ মেলেনি।'
            : 'New password and confirmation do not match.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await usersApi.changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });

      if (user) {
        setUser({ ...user, hasPassword: true, needPasswordUpdate: false });
      }

      setStatus({
        type: 'success',
        text:
          res?.data?.message ||
          (hasPassword
            ? locale === 'bn'
              ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!'
              : 'Password changed successfully!'
            : locale === 'bn'
              ? 'পাসওয়ার্ড সফলভাবে যোগ করা হয়েছে! এখন আপনি পাসওয়ার্ড দিয়েও সরাসরি লগইন করতে পারবেন।'
              : 'Password added successfully! You can now also sign in directly.'),
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (hasPassword
          ? locale === 'bn'
            ? 'পাসওয়ার্ড পরিবর্তনে ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার বর্তমান পাসওয়ার্ড যাচাই করুন।'
            : 'Failed to change password. Please check your current password.'
          : locale === 'bn'
            ? 'পাসওয়ার্ড যোগ করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
            : 'Failed to add password. Please try again.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {hasPassword
                ? locale === 'bn'
                  ? 'পাসওয়ার্ড পরিবর্তন করুন'
                  : 'Change Password'
                : locale === 'bn'
                  ? 'পাসওয়ার্ড যুক্ত করুন'
                  : 'Add Password'}
            </CardTitle>
            <CardDescription className="text-xs">
              {hasPassword
                ? locale === 'bn'
                  ? 'আপনার অ্যাকাউন্টের সুরক্ষার জন্য শক্তিশালী পাসওয়ার্ড ব্যবহার করুন'
                  : 'Ensure your account stays secure with a strong password'
                : locale === 'bn'
                  ? 'পাসওয়ার্ড যোগ করুন যাতে পরবর্তীতে ইমেইল বা ইউজারনেম দিয়ে সরাসরি লগইন করতে পারেন'
                  : 'Set a password to sign in with your email or username directly'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5 space-y-4">
        {status && (
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl p-3 text-xs font-medium border',
              status.type === 'success'
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/60 dark:border-primary-800 dark:text-primary-300'
                : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300'
            )}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasPassword && (
            <div className="relative">
              <Input
                label={
                  locale === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'
                }
                type={showCurrentPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showCurrentPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="relative">
              <Input
                label={
                  hasPassword
                    ? locale === 'bn'
                      ? 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)'
                      : 'New Password (min 6 chars)'
                    : locale === 'bn'
                      ? 'পাসওয়ার্ড নির্ধারণ করুন'
                      : 'Create Password'
                }
                type={showNewPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<KeyRound className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showNewPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label={
                  locale === 'bn'
                    ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন'
                    : 'Confirm New Password'
                }
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<KeyRound className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                {showConfirmPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              {locale === 'bn'
                ? 'পাসওয়ার্ডে ছোট-বড় অক্ষর, সংখ্যা ও স্পেশাল ক্যারেক্টার ব্যবহার করলে তা আরও নিরাপদ হয়।'
                : 'Using a combination of uppercase, lowercase, numbers, and symbols increases security.'}
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="rounded-xl px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9.5"
            >
              {hasPassword
                ? locale === 'bn'
                  ? 'পাসওয়ার্ড আপডেট করুন'
                  : 'Update Password'
                : locale === 'bn'
                  ? 'পাসওয়ার্ড যোগ করুন'
                  : 'Set Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
