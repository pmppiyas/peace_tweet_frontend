'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Mail, Calendar, LogOut } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

export function ProfileView() {
  const { user } = useAuth();
  const { logout, isLoggingOut } = useAuthActions();

  if (!user) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        User profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl overflow-hidden">
        <CardHeader className="text-center pb-4 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white text-2xl font-bold shadow-xs">
            {user.name.charAt(0)}
          </div>
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
          <div className="pt-2">
            <Badge variant={user.role === 'ADMIN' ? 'gold' : 'emerald'}>
              {user.role === 'ADMIN' ? 'Administrator' : 'Standard Member'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
              <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Email Address</p>
                <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#f0f2f5] p-3.5 dark:bg-[#3a3b3c]">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">Member Since</p>
                <p className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                  {user.createdAt ? formatDate(user.createdAt) : 'Today'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e4e6eb] dark:border-[#393a3b]">
            <Button
              variant="destructive"
              className="w-full gap-2 rounded-xl"
              onClick={() => logout()}
              isLoading={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
