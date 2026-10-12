import React from 'react';
import { NotificationPageView } from '@/features/notifications/components/NotificationPageView';

export const metadata = {
  title: 'Notifications | PeaceTweet',
  description: 'View and manage all your notifications on PeaceTweet.',
};

export default function NotificationsPage() {
  return <NotificationPageView />;
}
