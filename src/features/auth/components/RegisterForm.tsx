'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthActions } from '../hooks/useAuthActions';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BloodGroup } from '@/types/user.types';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  MapPin,
  Droplet,
  Camera,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

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

export function RegisterForm() {
  // Step navigation: 1 = Account info, 2 = Profile details
  const [step, setStep] = useState<1 | 2>(1);

  // Slide 1 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Slide 2 fields
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>(undefined);

  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, isRegistering } = useAuthActions();

  // Validate slide 1 before proceeding
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setStep(2);
  };


  const handleGoogleLogin = () => {
    setErrorMessage('Google login coming soon!');
  };

  // Handle avatar image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file must be less than 5MB.');
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

  // Complete registration (withDetails = true → include photo/location/blood group)
  const handleFinalSubmit = async (withDetails: boolean) => {
    setErrorMessage('');
    let uploadedAvatarUrl: string | undefined = undefined;

    try {
      if (withDetails && avatarFile) {
        setIsUploadingPhoto(true);
        const uploadRes = await uploadsApi.uploadImage(avatarFile);
        uploadedAvatarUrl = uploadRes.data.url;
        setIsUploadingPhoto(false);
      }

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatarUrl: withDetails ? uploadedAvatarUrl : undefined,
        location: withDetails && location.trim() ? location.trim() : undefined,
        bloodGroup: withDetails ? bloodGroup : undefined,
      });
    } catch (err: any) {
      setIsUploadingPhoto(false);
      const msg =
        err?.response?.data?.message || 'Registration failed. Try a different email address.';
      setErrorMessage(msg);
    }
  };

  const isSubmitting = isRegistering || isUploadingPhoto;

  return (
    <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs">
          <UserPlus className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl font-bold">Create an Account</CardTitle>
        <CardDescription className="text-xs">
          {step === 1 ? 'Step 1 of 2: Your Details' : 'Step 2 of 2: Profile & Photo (Optional)'}
        </CardDescription>

        {/* Step progress bar */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              step === 1 ? 'w-10 bg-primary-500' : 'w-6 bg-primary-500/50',
            )}
          />
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              step === 2 ? 'w-10 bg-primary-500' : 'w-6 bg-gray-200 dark:bg-gray-700',
            )}
          />
        </div>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-3.5 rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* ─── Slide 1: Account Credentials ─── */}
        {step === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-3.5 animate-fadeIn">
            <Input
              label="Full Name"
              placeholder="e.g. Abdullah Hasan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            {/* Password with show/hide toggle */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password with show/hide toggle */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
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
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#3a3b3c] hover:bg-[#f0f2f5] dark:hover:bg-[#444546] transition-colors py-2.5 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-2xs"
            >
              {/* Google G icon */}
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

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
              Already have an account?{' '}
              <Link
                href={ROUTES.LOGIN}
                className="font-bold text-primary-500 hover:underline dark:text-primary-400"
              >
                Sign In
              </Link>
            </p>
          </form>
        )}

        {/* ─── Slide 2: Photo, Location, Blood Group ─── */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Avatar Picker */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Profile Photo (Optional)
              </label>

              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 transition-all hover:border-primary-500 overflow-hidden bg-gray-50 dark:border-gray-600 dark:bg-gray-800 shadow-2xs',
                    avatarPreview ? 'border-primary-500 border-solid' : '',
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
                      <Camera className="h-7 w-7 mb-1" />
                      <span className="text-[10px] font-medium">Add Photo</span>
                    </div>
                  )}
                </div>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700 transition-all"
                    title="Remove Photo"
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
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 text-center">
                JPG, PNG or WEBP up to 5MB
              </p>
            </div>

            {/* Location */}
            <Input
              label="Location (City, Country)"
              placeholder="e.g. Dhaka, Bangladesh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4 text-primary-500" />}
            />

            {/* Blood Group pills */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Droplet className="h-4 w-4 text-red-500" />
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Blood Group (Optional)
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = bloodGroup === bg.value;
                  return (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => setBloodGroup(isSelected ? undefined : bg.value)}
                      className={cn(
                        'flex items-center justify-center gap-1 rounded-xl border py-2 px-1 text-xs font-bold transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/70 dark:text-primary-300 shadow-2xs'
                          : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                      )}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-500 shrink-0" />}
                      <span>{bg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={() => handleFinalSubmit(true)}
                className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-xs"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isUploadingPhoto
                  ? 'Uploading Photo...'
                  : isRegistering
                    ? 'Creating Account...'
                    : 'Complete Registration'}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setErrorMessage('');
                    setStep(1);
                  }}
                  className="flex-1 rounded-xl text-xs"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleFinalSubmit(false)}
                  className="flex-1 rounded-xl text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  disabled={isSubmitting}
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
