'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGroupForm } from '@/features/groups/components/CreateGroupForm';
import { GroupsLayout } from '@/features/groups/components/GroupsLayout';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function CreateGroupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <GroupsLayout>
      <CreateGroupForm />
    </GroupsLayout>
  );
}
