'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthActions } from '../hooks/useAuthActions';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroup } from '@/types/user.types';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Droplet,
  Camera,
  ArrowRight,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
import { LocationSelector, LocationValue } from '@/components/ui/LocationSelector';

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export function RegisterView() {
  const { locale } = useLanguage();

  // Multi-step navigation:
  // 1 = Name & Email
  // 2 = Password & Confirm Password
  // 3 = Profile Photo
  // 4 = Location
  // 5 = Blood Group
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 3: Profile Photo
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Step 4: Location
  const [locationData, setLocationData] = useState<LocationValue>({
    country: 'Bangladesh',
    countryCode: 'BD',
    state: '',
    city: '',
    location: '',
  });

  // Step 5: Blood Group
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>(undefined);

  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, isRegistering } = useAuthActions();

  // Validate Step 1: Name and Email
  const handleProceedFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim()) {
      setErrorMessage(
        locale === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম এবং ইমেইল এড্রেস লিখুন।'
          : 'Please enter your name and email address.',
      );
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage(
        locale === 'bn'
          ? 'পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে।'
          : 'Full name must be at least 2 characters.',
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage(
        locale === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন।'
          : 'Please enter a valid email address.',
      );
      return;
    }

    setStep(2);
  };

  // Validate Step 2: Password and Confirm Password
  const handleProceedFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage(
        locale === 'bn'
          ? 'অনুগ্রহ করে পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড প্রদান করুন।'
          : 'Please enter and confirm your password.',
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        locale === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        locale === 'bn'
          ? 'পাসওয়ার্ড দুটি মেলেনি। উভয় ফিল্ডে একই পাসওয়ার্ড দিন।'
          : 'Passwords do not match. Please enter the same password.',
      );
      return;
    }

    setStep(3);
  };

  // Avatar file handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        locale === 'bn'
          ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।'
          : 'Image file must be less than 5MB.',
      );
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMessage('');
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Final Registration Submission (called on Step 5)
  const handleFinalSubmit = async (includeBloodGroup: boolean) => {
    setErrorMessage('');
    let uploadedAvatarUrl: string | undefined = undefined;

    try {
      if (avatarFile) {
        setIsUploadingPhoto(true);
        const uploadRes = await uploadsApi.uploadImage(avatarFile);
        uploadedAvatarUrl = uploadRes.data.url;
        setIsUploadingPhoto(false);
      }

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatarUrl: uploadedAvatarUrl,
        country: locationData.location ? locationData.country : undefined,
        countryCode: locationData.location ? locationData.countryCode : undefined,
        state: locationData.location ? locationData.state : undefined,
        city: locationData.location ? locationData.city : undefined,
        location: locationData.location?.trim() ? locationData.location.trim() : undefined,
        bloodGroup: includeBloodGroup ? bloodGroup : undefined,
      });
    } catch (err: any) {
      setIsUploadingPhoto(false);
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। ভিন্ন ইমেইল দিয়ে পুনরায় চেষ্টা করুন।'
          : 'Registration failed. Please try a different email.');
      setErrorMessage(msg);
    }
  };

  const isSubmitting = isRegistering || isUploadingPhoto;

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
              ? 'PeaceTweet-এ যুক্ত হয়ে পবিত্র ইসলামিক ভাবগাম্ভীর্যপূর্ণ পরিবেশে সহিহ দোয়া ও আত্মশুদ্ধিকর আলোচনায় অংশ নিন।'
              : 'Join PeaceTweet to connect with peaceful hearts and practice daily authentic duas.'}
          </p>
        </div>

        {/* ================= RIGHT SIDE: Scroll-free Step Card ================= */}
        <div className="w-full lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
          {/* Mobile-only compact header */}
          <div className="lg:hidden text-center mb-2">
            <h2 className="text-base sm:text-lg font-bold text-[#1c1e21] dark:text-[#e4e6eb]">
              {locale === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'}
            </h2>
          </div>

          {/* Main Card */}
          <div className="w-full max-w-[390px] xl:max-w-[420px] rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xl p-5 sm:p-6">
            {/* Step Progress Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : 1));
                      }}
                      className="p-1 -ml-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-[#f0f2f5] dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#3a3b3c] transition-colors"
                      title={locale === 'bn' ? 'পূর্ববর্তী ধাপ' : 'Previous Step'}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  )}
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
                    {locale === 'bn' ? `ধাপ ${step} / ৫` : `Step ${step} of 5`}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#65676b] dark:text-[#b0b3b8]">
                  {step === 1 && (locale === 'bn' ? 'নাম ও ইমেইল' : 'Name & Email')}
                  {step === 2 && (locale === 'bn' ? 'পাসওয়ার্ড নির্ধারণ' : 'Set Password')}
                  {step === 3 && (locale === 'bn' ? 'প্রোফাইল ছবি' : 'Profile Photo')}
                  {step === 4 && (locale === 'bn' ? 'লোকেশন' : 'Your Location')}
                  {step === 5 && (locale === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group')}
                </span>
              </div>

              {/* Progress Bar Indicator: 5 Steps */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      s <= step
                        ? 'bg-primary-500 dark:bg-primary-400'
                        : 'bg-gray-200 dark:bg-gray-700',
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="mb-3 rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 1: Name & Email
            ═════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <form onSubmit={handleProceedFromStep1} className="space-y-3">
                <div className="text-center pb-1">
                  <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'আপনার তথ্য দিন' : 'Your Basic Info'}
                  </h3>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    {locale === 'bn'
                      ? 'শুরু করতে আপনার পূর্ণ নাম ও ইমেইল লিখুন'
                      : 'Enter your full name and email to get started'}
                  </p>
                </div>

                <Input
                  label={locale === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'}
                  placeholder={locale === 'bn' ? 'যেমন: আবদুল্লাহ হাসান' : 'e.g. Abdullah Hasan'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />

                <Input
                  label={locale === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <div className="pt-1.5">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2 shadow-sm"
                  >
                    <span>{locale === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Already have an account link */}
                <div className="text-center pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    {locale === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
                    <Link
                      href={ROUTES.LOGIN}
                      className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {locale === 'bn' ? 'লগইন করুন' : 'Log In'}
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 2: Password & Confirm Password
            ═════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <form onSubmit={handleProceedFromStep2} className="space-y-3">
                <div className="text-center pb-1">
                  <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'একটি শক্তিশালী পাসওয়ার্ড দিন' : 'Create a Password'}
                  </h3>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    {locale === 'bn'
                      ? 'নিরাপত্তার স্বার্থে কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড ব্যবহার করুন'
                      : 'Use at least 6 characters to secure your account'}
                  </p>
                </div>

                <div className="relative">
                  <Input
                    label={locale === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min. 6 chars)'}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label={locale === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="pt-1.5">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-2 shadow-sm"
                  >
                    <span>{locale === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 3: Profile Photo (Optional / Skip)
            ═════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'প্রোফাইল ছবি যুক্ত করুন' : 'Add a Profile Photo'}
                  </h3>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    {locale === 'bn'
                      ? 'বন্ধুদের আপনাকে চিনতে সুবিধা হবে (ঐচ্ছিক)'
                      : 'Help friends recognize you (optional)'}
                  </p>
                </div>

                {/* Avatar Uploader Preview Circle */}
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="relative group">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 shadow-inner overflow-hidden transition-all hover:border-primary-500 active:scale-95',
                        avatarPreview && 'border-primary-500 border-solid ring-2 ring-primary-500/20',
                      )}
                    >
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <Camera className="h-7 w-7 mb-1 text-primary-500" />
                          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                            {locale === 'bn' ? 'ছবি দিন' : 'Upload'}
                          </span>
                        </div>
                      )}
                    </div>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                        title={locale === 'bn' ? 'ছবি মুছুন' : 'Remove photo'}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-2">
                    JPG, PNG or WEBP (max 5MB)
                  </p>
                </div>

                {/* Step 3 Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setErrorMessage('');
                      setStep(4);
                    }}
                    className="rounded-xl border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold py-2"
                  >
                    {locale === 'bn' ? 'স্কিপ করুন' : 'Skip'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setStep(4);
                    }}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2 shadow-xs"
                  >
                    {locale === 'bn' ? 'পরবর্তী' : 'Next'}
                  </Button>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 4: Location (Optional / Skip)
            ═════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="space-y-3.5">
                <div className="text-center">
                  <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'আপনার লোকেশন' : 'Your Location'}
                  </h3>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    {locale === 'bn'
                      ? 'আপনার দেশ ও বিভাগ/এলাকা নির্বাচন করুন (ঐচ্ছিক)'
                      : 'Select your country and area (optional)'}
                  </p>
                </div>

                {/* Cascading Global & Bangladesh Location Selector */}
                <LocationSelector
                  value={locationData}
                  onChange={setLocationData}
                  locale={locale}
                />

                {/* Step 4 Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setErrorMessage('');
                      // Clear location so it's not saved when skipped
                      setLocationData({ country: '', countryCode: '', state: '', city: '', location: '' });
                      setStep(5);
                    }}
                    className="rounded-xl border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold py-2"
                  >
                    {locale === 'bn' ? 'স্কিপ করুন' : 'Skip'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setStep(5);
                    }}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2 shadow-xs"
                  >
                    {locale === 'bn' ? 'পরবর্তী' : 'Next'}
                  </Button>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════
                STEP 5: Blood Group (Optional / Complete)
            ═════════════════════════════════════════════════════════ */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Select Blood Group'}
                  </h3>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    {locale === 'bn'
                      ? 'জরুরি রক্তদানের সুবিধার্থে আপনার রক্তের গ্রুপ দিন (ঐচ্ছিক)'
                      : 'Help in emergencies by sharing your blood group (optional)'}
                  </p>
                </div>

                {/* 8 Blood Group Chips */}
                <div className="grid grid-cols-4 gap-2 py-1">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg.value;
                    return (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setBloodGroup(isSelected ? undefined : bg.value)}
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-xl border py-2.5 px-1 text-xs font-bold transition-all cursor-pointer',
                          isSelected
                            ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 ring-2 ring-red-500/20 shadow-xs'
                            : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                        )}
                      >
                        <Droplet
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            isSelected ? 'fill-red-500 text-red-500' : 'text-red-500',
                          )}
                        />
                        <span>{bg.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Step 5 Actions: Skip or Complete */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleFinalSubmit(false)}
                    disabled={isSubmitting}
                    className="rounded-xl border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold py-2"
                  >
                    {locale === 'bn' ? 'স্কিপ করুন' : 'Skip & Finish'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleFinalSubmit(true)}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2 shadow-xs"
                  >
                    {isUploadingPhoto
                      ? locale === 'bn' ? 'ছবি আপলোড হচ্ছে...' : 'Uploading Photo...'
                      : isRegistering
                        ? locale === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'
                        : locale === 'bn' ? 'সম্পন্ন করুন' : 'Complete'}
                  </Button>
                </div>
              </div>
            )}
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
