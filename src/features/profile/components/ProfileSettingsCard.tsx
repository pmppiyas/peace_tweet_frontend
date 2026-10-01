'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { usersApi } from '../api/users.api';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BloodGroup } from '@/types/user.types';
import {
  User,
  AtSign,
  Mail,
  MapPin,
  Droplet,
  Camera,
  CheckCircle2,
  Loader2,
  AlertCircle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
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

export interface ProfileSettingsCardProps {
  section?: 'all' | 'profile' | 'security';
}

export function ProfileSettingsCard({ section = 'all' }: ProfileSettingsCardProps) {
  const { user } = useAuth();
  const { setUser } = useAuthStore();

  // Profile fields state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>(
    undefined
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setLocation(user.location || '');
      setBloodGroup(user.bloodGroup || undefined);
      setAvatarUrl(user.avatarUrl || null);
    }
  }, [user]);

  // Sync latest profile (including hasPassword flag) from server on mount
  useEffect(() => {
    usersApi
      .getProfile()
      .then((res) => {
        if (res?.data) {
          setUser(res.data);
        }
      })
      .catch(() => {
        // Ignore background refresh error
      });
  }, [setUser]);

  const hasPassword = user?.hasPassword !== false;

  // Handle avatar upload via Cloudinary
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileStatus({
        type: 'error',
        text: 'Image file must be under 5MB.',
      });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileStatus(null);

    try {
      const uploadRes = await uploadsApi.uploadAvatar(file);
      const newAvatarUrl = uploadRes.data.url;
      setAvatarUrl(newAvatarUrl);

      // Auto update user profile with new avatar
      const updateRes = await usersApi.updateProfile({
        avatarUrl: newAvatarUrl,
      });
      setUser(updateRes.data);
      setProfileStatus({
        type: 'success',
        text: 'Profile picture updated successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Failed to upload image. Please try again.';
      setProfileStatus({ type: 'error', text: msg });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileStatus({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      setProfileStatus({
        type: 'error',
        text: 'Username must be at least 3 characters.',
      });
      return;
    }

    if (!email.trim()) {
      setProfileStatus({ type: 'error', text: 'Email cannot be empty.' });
      return;
    }

    setIsSavingProfile(true);
    setProfileStatus(null);

    try {
      const updateRes = await usersApi.updateProfile({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        location: location.trim() || null,
        bloodGroup: bloodGroup || null,
      });

      setUser(updateRes.data);
      setProfileStatus({
        type: 'success',
        text: 'Profile details saved successfully!',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update profile.';
      setProfileStatus({ type: 'error', text: msg });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Set or Change Password submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (hasPassword && !currentPassword) {
      setPasswordStatus({
        type: 'error',
        text: 'Please enter your current password.',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        text: 'New password and confirmation do not match.',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await usersApi.changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });

      if (user) {
        setUser({ ...user, hasPassword: true });
      }

      setPasswordStatus({
        type: 'success',
        text:
          res?.data?.message ||
          (hasPassword
            ? 'Password changed successfully!'
            : 'Password set successfully! You can now also sign in with your email and password.'),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (hasPassword
          ? 'Failed to change password. Please check your current password.'
          : 'Failed to set password. Please try again.');
      setPasswordStatus({ type: 'error', text: msg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  const showProfile = section === 'all' || section === 'profile';
  const showSecurity = section === 'all' || section === 'security';

  return (
    <div className="space-y-4">
      {/* Profile Details Card */}
      {showProfile && (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary-500" />
            <CardTitle className="text-sm font-semibold">
              Personal Profile Details
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Update your photo, name, username, email, location, and blood group
          </CardDescription>
        </CardHeader>

        <CardContent>
          {profileStatus && (
            <div
              className={cn(
                'mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-medium border',
                profileStatus.type === 'success'
                  ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/60 dark:border-primary-800 dark:text-primary-300'
                  : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300'
              )}
            >
              {profileStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{profileStatus.text}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-4 pb-3 border-b border-[#f0f2f5] dark:border-[#3a3b3c]">
              <div className="relative group">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary-500/30 bg-primary-500 text-white shadow-xs">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs hover:bg-primary-600 transition-all"
                  title="Change Photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  placeholder="e.g. Abdullah Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Username"
                  placeholder="e.g. abdullah99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leftIcon={<AtSign className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Location (City, Country)"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  leftIcon={<MapPin className="h-4 w-4 text-primary-500" />}
                />
              </div>

              {/* Blood Group Picker */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Droplet className="h-4 w-4 text-red-500" />
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Blood Group
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg.value;
                    return (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() =>
                          setBloodGroup(isSelected ? undefined : bg.value)
                        }
                        className={cn(
                          'flex items-center justify-center gap-1 rounded-xl border py-2 px-1 text-xs font-bold transition-all',
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/70 dark:text-primary-300 shadow-2xs'
                            : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]'
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 text-primary-500 shrink-0" />
                        )}
                        <span>{bg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold"
                  isLoading={isSavingProfile}
                  disabled={isSavingProfile}
                >
                  Save Profile Details
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Set / Change Password Card */}
      {showSecurity && (
        <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-primary-500" />
            <CardTitle className="text-sm font-semibold">
              {hasPassword ? 'Change Password' : 'Set Account Password'}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {hasPassword
              ? 'Update your account security with a strong, unique password'
              : 'Set a password so you can also sign in directly using your email or username'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!hasPassword && (
            <div className="mb-4 rounded-xl bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/60 p-3 text-xs text-primary-800 dark:text-primary-200">
              You signed in using Facebook. Set a password below to enable
              signing in with your email (<strong>{user.email}</strong>) or
              username (<strong>@{user.username}</strong>).
            </div>
          )}

          {passwordStatus && (
            <div
              className={cn(
                'mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-medium border',
                passwordStatus.type === 'success'
                  ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/60 dark:border-primary-800 dark:text-primary-300'
                  : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300'
              )}
            >
              {passwordStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{passwordStatus.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            {/* Current Password (only shown if user already has a password) */}
            {hasPassword && (
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showCurrentPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}

            {/* New Password */}
            <div className="relative">
              <Input
                label={hasPassword ? 'New Password' : 'Password'}
                type={showNewPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showNewPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <Input
                label={
                  hasPassword ? 'Confirm New Password' : 'Confirm Password'
                }
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold"
                isLoading={isChangingPassword}
                disabled={isChangingPassword}
              >
                {hasPassword ? 'Update Password' : 'Set Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
