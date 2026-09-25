'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { User, AtSign, Mail, Lock, UserPlus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, isRegistering } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register({ name, username, email, password });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Registration failed. Try a different email or username.';
      setErrorMessage(msg);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xs border border-[#e4e6eb] bg-white dark:border-[#393a3b] dark:bg-[#242526] rounded-xl">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
          <UserPlus className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">Create an Account</CardTitle>
        <CardDescription>
          Join PeaceTweet to save Duas, post reflections, and explore prophetic prayers.
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
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <Button type="submit" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" isLoading={isRegistering}>
            Create Account
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            Already have an account?{' '}
            <Link
              href={ROUTES.LOGIN}
              className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
