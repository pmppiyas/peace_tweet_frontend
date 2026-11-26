'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { useToast } from '@/providers/ToastProvider';
import { useGoogleSDK } from '@/features/auth/hooks/useGoogleSDK';
import { usersApi } from '../api/users.api';
import {
  User,
  AtSign,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function BasicInfoSettingsCard() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();
  const { showToast } = useToast();
  const { redirectToGoogleOAuth, isLoading: isGoogleRedirecting } = useGoogleSDK();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isConfirmingOtp, setIsConfirmingOtp] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get('gmailVerified') === '1') {
      const pts = Number(searchParams.get('pts') || '0');
      showToast({
        type: 'success',
        message:
          locale === 'bn'
            ? `Google দিয়ে জিমেইল সফলভাবে ভেরিফাই হয়েছে${pts > 0 ? ` (+${pts} পয়েন্ট!)` : '!'}`
            : `Gmail verified with Google successfully${pts > 0 ? ` (+${pts} pts!)` : '!'}`,
      });
    }
  }, [searchParams, locale, showToast]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn' ? 'নাম খালি রাখা যাবে না।' : 'Name cannot be empty.',
      });
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে।'
            : 'Username must be at least 3 characters.',
      });
      return;
    }

    if (username.trim().length > 10) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইউজারনেম সর্বোচ্চ ১০ অক্ষরের হতে হবে।'
            : 'Username must not exceed 10 characters.',
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইউজারনেমে শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা, আন্ডারস্কোর (_) এবং হাইফেন (-) থাকতে পারবে।'
            : 'Username can only contain letters, numbers, underscores and hyphens.',
      });
      return;
    }

    if (!email.trim()) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইমেইল খালি রাখা যাবে না।'
            : 'Email cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const payload: Record<string, string | null> = {};
      const nextName = name.trim();
      const nextUsername = username.trim().toLowerCase();
      const nextEmail = email.trim().toLowerCase();
      const nextBio = bio.trim() || null;

      if (nextName !== (user?.name || '').trim()) payload.name = nextName;
      if (nextUsername !== (user?.username || '').toLowerCase()) payload.username = nextUsername;
      if (nextEmail !== (user?.email || '').toLowerCase()) payload.email = nextEmail;
      if (nextBio !== (user?.bio?.trim() || null)) payload.bio = nextBio;

      if (Object.keys(payload).length === 0) {
        showToast({
          type: 'info',
          message:
            locale === 'bn'
              ? 'কোনো পরিবর্তন করা হয়নি।'
              : 'No changes to save.',
        });
        return;
      }

      const res = await usersApi.updateProfile(payload);

      setUser(res.data);
      showToast({
        type: 'success',
        message:
          locale === 'bn'
            ? 'সাধারণ তথ্য সফলভাবে সংরক্ষিত হয়েছে!'
            : 'Basic info saved successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'তথ্য আপডেট করতে ব্যর্থ হয়েছে।'
          : 'Failed to update info.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const normalizedInputEmail = email.trim().toLowerCase();
  const isCurrentEmailVerified =
    Boolean(user?.emailVerified) &&
    normalizedInputEmail === (user?.email || '').trim().toLowerCase();

  const handleSendOtp = async () => {
    if (!normalizedInputEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedInputEmail)) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'অনুগ্রহ করে একটি সঠিক জিমেইল বা ইমেইল লিখুন।'
            : 'Please enter a valid Gmail or email address.',
      });
      return;
    }

    setIsSendingOtp(true);
    setStatus(null);
    try {
      const res = await usersApi.requestEmailVerification(normalizedInputEmail);
      const data = res?.data;
      if (data?.alreadyVerified) {
        const refreshed = await usersApi.getProfile();
        if (refreshed?.data) setUser(refreshed.data);
        showToast({
          type: 'success',
          message:
            locale === 'bn'
              ? 'আপনার ইমেইল ইতিমধ্যেই ভেরিফাইড!'
              : 'Your email is already verified!',
        });
        return;
      }
      setOtpSent(true);
      setDevOtpHint(data?.devCode || null);
      showToast({
        type: 'success',
        message:
          data?.deliveryMode === 'dev' && data?.devCode
            ? locale === 'bn'
              ? `ভেরিফিকেশন কোড তৈরি হয়েছে: ${data.devCode}`
              : `Verification code ready: ${data.devCode}`
            : locale === 'bn'
              ? `${data?.email || normalizedInputEmail} এ ৬-সংখ্যার কোড পাঠানো হয়েছে।`
              : `A 6-digit verification code was sent to ${data?.email || normalizedInputEmail}.`,
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        text:
          err?.response?.data?.message ||
          (locale === 'bn'
            ? 'ভেরিফিকেশন কোড পাঠাতে ব্যর্থ হয়েছে।'
            : 'Failed to send verification code.'),
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmOtp = async () => {
    const cleanCode = otpCode.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? '৬-সংখ্যার সঠিক কোড লিখুন।'
            : 'Please enter a valid 6-digit verification code.',
      });
      return;
    }

    setIsConfirmingOtp(true);
    setStatus(null);
    try {
      const res = await usersApi.confirmEmailVerification(
        cleanCode,
        normalizedInputEmail
      );
      const data = res?.data;
      if (data?.user) {
        setUser(data.user);
      }
      setOtpSent(false);
      setOtpCode('');
      setDevOtpHint(null);
      const pts = data?.pointsAwarded ?? 0;
      const badgeMsg =
        data?.userStatus === 'VERIFIED'
          ? locale === 'bn'
            ? ' গ্রীন ভেরিফাইড আইকন আনলক হয়েছে!'
            : ' Green Verified Icon unlocked!'
          : '';
      showToast({
        type: 'success',
        message:
          (locale === 'bn'
            ? 'জিমেইল সফলভাবে ভেরিফাই হয়েছে!'
            : 'Gmail verified successfully!') +
          (pts > 0
            ? locale === 'bn'
              ? ` (+${pts} পয়েন্ট!)`
              : ` (+${pts} pts!)`
            : '') +
          badgeMsg,
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        text:
          err?.response?.data?.message ||
          (locale === 'bn'
            ? 'ভেরিফিকেশন কোড সঠিক নয়।'
            : 'Invalid verification code.'),
      });
    } finally {
      setIsConfirmingOtp(false);
    }
  };

  const handleVerifyWithGoogle = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('pt_google_verify_email', '1');
    }
    redirectToGoogleOAuth();
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
            <User className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'সাধারণ প্রোফাইল তথ্য' : 'Basic Profile Info'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার পুরো নাম, ইউজারনেম, ইমেইল ও সংক্ষিপ্ত পরিচয় পরিবর্তন করুন'
                : 'Manage your name, username, email, and short biography'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5">
        {status && (
          <div
            className={cn(
              'mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-medium border',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label={locale === 'bn' ? 'পুরো নাম *' : 'Full Name *'}
              placeholder="e.g. Abdullah Hasan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label={
                locale === 'bn'
                  ? 'ইউজারনেম (সর্বোচ্চ ১০ অক্ষর) *'
                  : 'Username (Max 10 chars) *'
              }
              placeholder="e.g. mamun99"
              value={username}
              maxLength={10}
              onChange={(e) =>
                setUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_-]/g, '')
                    .slice(0, 10)
                )
              }
              leftIcon={<AtSign className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {locale === 'bn' ? 'জিমেইল / ইমেইল অ্যাড্রেস *' : 'Gmail / Email Address *'}
              </label>
              {isCurrentEmailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === 'bn' ? 'ভেরিফাইড' : 'Verified'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {locale === 'bn'
                      ? '+৩০ পয়েন্ট • গ্রীন ভেরিফাইড আইকনের জন্য বাধ্যতামূলক'
                      : '+30 pts • Mandatory for Green Verified Icon'}
                  </span>
                </span>
              )}
            </div>

            <Input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (otpSent) {
                  setOtpSent(false);
                  setOtpCode('');
                  setDevOtpHint(null);
                }
              }}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            {!isCurrentEmailVerified ? (
              <div className="rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f8fafc] dark:bg-[#1e1f21] p-3 space-y-2.5">
                <p className="text-[11.5px] text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? 'গ্রীন ভেরিফাইড আইকন পেতে ও +৩০ পয়েন্ট অর্জন করতে আপনার জিমেইল ভেরিফাই করা বাধ্যতামূলক।'
                    : 'Verifying your Gmail/email is mandatory for the green verified icon and earns +30 points.'}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyWithGoogle}
                    isLoading={isGoogleRedirecting}
                    disabled={isGoogleRedirecting || isSendingOtp || isConfirmingOtp}
                    className="rounded-xl text-xs h-9 px-3.5 border-[#d0d5dd] dark:border-[#4a4b4d] bg-white dark:bg-[#242526]"
                  >
                    {locale === 'bn' ? 'Google দিয়ে ভেরিফাই' : 'Verify with Google'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    isLoading={isSendingOtp}
                    disabled={isSendingOtp || isConfirmingOtp || isGoogleRedirecting}
                    className="rounded-xl text-xs h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {otpSent
                      ? locale === 'bn'
                        ? 'আবার কোড পাঠান'
                        : 'Resend Code'
                      : locale === 'bn'
                        ? 'কোড পাঠান (OTP)'
                        : 'Send Code (OTP)'}
                  </Button>
                </div>

                {otpSent && (
                  <div className="space-y-2 pt-1">
                    {devOtpHint && (
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {locale === 'bn'
                          ? `ডেভ ভেরিফিকেশন কোড: ${devOtpHint}`
                          : `Verification Code: ${devOtpHint}`}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={
                          locale === 'bn' ? '৬-সংখ্যার কোড' : '6-digit code'
                        }
                        value={otpCode}
                        maxLength={6}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        className="font-bold tracking-widest text-center"
                      />
                      <Button
                        type="button"
                        onClick={handleConfirmOtp}
                        isLoading={isConfirmingOtp}
                        disabled={isConfirmingOtp || otpCode.trim().length !== 6}
                        className="rounded-xl text-xs h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0"
                      >
                        {locale === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11.5px] font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {user?.userStatus === 'VERIFIED'
                    ? locale === 'bn'
                      ? 'আপনার গ্রীন ভেরিফাইড আইকন সক্রিয় আছে!'
                      : 'Your green verified icon is active!'
                    : locale === 'bn'
                      ? 'জিমেইল ভেরিফাইড ✓ গ্রীন ভেরিফাইড আইকন পেতে প্রোফাইল ছবি, কভার, বায়ো ও ঠিকানা পূরণ করুন।'
                      : 'Gmail verified ✓ Complete photo, cover, bio, and location to unlock the green verified icon.'}
                </span>
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {locale === 'bn'
                  ? 'বায়ো / সংক্ষিপ্ত পরিচয়'
                  : 'Bio (Short Intro)'}
              </label>
              <span className="text-[10px] text-gray-400">
                {bio.length}/250
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={250}
              placeholder={
                locale === 'bn'
                  ? 'নিজের সম্পর্কে কিছু লিখুন...'
                  : 'Write a short intro, quote or reflection about yourself...'
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] p-3 text-xs placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="rounded-xl px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs h-9.5"
            >
              {locale === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Details'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
