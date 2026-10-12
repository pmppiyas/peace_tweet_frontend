'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  Droplet,
  Trash2,
  Inbox,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';
import { soundEffects } from '@/lib/sound/soundEffects';
import {
  NotificationFilter,
  NotificationItem,
  NotificationType,
} from '../types/notification.types';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '../hooks/useNotifications';

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    return date.toLocaleDateString();
  } catch {
    return '';
  }
}

function getNotificationBadge(type: NotificationType) {
  switch (type) {
    case 'POST_LIKE':
      return {
        icon: Heart,
        bgColor: 'bg-rose-500',
        textColor: 'text-white',
      };
    case 'POST_COMMENT':
      return {
        icon: MessageCircle,
        bgColor: 'bg-emerald-500',
        textColor: 'text-white',
      };
    case 'FRIEND_REQUEST':
      return {
        icon: UserPlus,
        bgColor: 'bg-blue-600',
        textColor: 'text-white',
      };
    case 'FRIEND_ACCEPT':
      return {
        icon: UserCheck,
        bgColor: 'bg-teal-500',
        textColor: 'text-white',
      };
    case 'BLOOD_REQUEST':
      return {
        icon: Droplet,
        bgColor: 'bg-red-600',
        textColor: 'text-white',
      };
    case 'SYSTEM':
    default:
      return {
        icon: Bell,
        bgColor: 'bg-amber-500',
        textColor: 'text-white',
      };
  }
}

export function NotificationPageView() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL');

  const { data: notificationsData, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const allNotifications = useMemo(
    () => notificationsData?.data || [],
    [notificationsData?.data]
  );

  const unreadCount =
    notificationsData?.meta?.unreadCount ??
    allNotifications.filter((n) => !n.isRead).length;

  const displayedNotifications = useMemo(() => {
    if (activeFilter === 'UNREAD') {
      return allNotifications.filter((item) => !item.isRead);
    }
    return allNotifications;
  }, [activeFilter, allNotifications]);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }

    switch (item.type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPT':
        if (item.actor?.username) {
          router.push(ROUTES.USER_PROFILE(item.actor.username));
        } else {
          router.push(ROUTES.FRIENDS.REQUESTS);
        }
        break;

      case 'POST_LIKE':
      case 'POST_COMMENT':
        if (item.entityId) {
          router.push(`/?post=${item.entityId}`);
        } else if (item.actor?.username) {
          router.push(ROUTES.USER_PROFILE(item.actor.username));
        } else {
          router.push(ROUTES.HOME);
        }
        break;

      case 'BLOOD_REQUEST':
        router.push(ROUTES.BLOOD.HOME);
        break;

      default:
        if (item.actor?.username) {
          router.push(ROUTES.USER_PROFILE(item.actor.username));
        } else {
          router.push(ROUTES.HOME);
        }
        break;
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playTab();
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEffects.playDelete();
    deleteMutation.mutate(id);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-white dark:bg-[#18191a] sm:bg-[#f0f2f5]">
      <Container size="2xl" className="h-full px-0 sm:px-4 lg:px-6 2xl:px-8">
        <div className="flex h-full justify-between gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none pb-20 sm:pb-8 px-2 sm:px-0">
            {/* Flat Content Display: Edge-to-edge on mobile, sleek and unboxed */}
            <div className="w-full bg-white dark:bg-[#242526] sm:rounded-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:shadow-2xs overflow-hidden sm:my-4">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#050505] dark:text-[#e4e6eb]">
                    Notifications
                  </h1>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                    Stay updated with your activities and friends
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={markAllAsReadMutation.isPending}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs: All / Unread */}
              <div className="flex items-center gap-2 px-4 py-2.5 sm:px-6 border-b border-[#e4e6eb]/60 dark:border-[#393a3b]/60 bg-[#f7f8fa]/60 dark:bg-[#18191a]/40">
                <button
                  type="button"
                  onClick={() => setActiveFilter('ALL')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer',
                    activeFilter === 'ALL'
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'bg-white border border-[#e4e6eb] text-[#65676b] hover:text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#b0b3b8]'
                  )}
                >
                  All ({allNotifications.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter('UNREAD')}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer',
                    activeFilter === 'UNREAD'
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'bg-white border border-[#e4e6eb] text-[#65676b] hover:text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#b0b3b8]'
                  )}
                >
                  <span>Unread</span>
                  {unreadCount > 0 && (
                    <span
                      className={cn(
                        'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none',
                        activeFilter === 'UNREAD'
                          ? 'bg-white text-primary-600'
                          : 'bg-red-600 text-white'
                      )}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Notifications List - Flat edge-to-edge list */}
              <div className="divide-y divide-[#e4e6eb]/60 dark:divide-[#393a3b]/60">
                {isLoading && allNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#65676b] dark:text-[#b0b3b8] gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    <p className="text-sm font-medium">
                      Loading notifications...
                    </p>
                  </div>
                ) : displayedNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-[#65676b] dark:text-[#b0b3b8]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] mb-3">
                      <Inbox className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <p className="font-bold text-[#050505] dark:text-[#e4e6eb] text-base">
                      {activeFilter === 'UNREAD'
                        ? 'No unread notifications'
                        : 'No notifications yet'}
                    </p>
                    <p className="text-xs mt-1 text-[#65676b] dark:text-[#b0b3b8] max-w-sm">
                      {activeFilter === 'UNREAD'
                        ? 'You are all caught up! There are no unread notifications.'
                        : 'When someone likes or comments on your posts, or sends you a friend request, you will see it here.'}
                    </p>
                  </div>
                ) : (
                  displayedNotifications.map((item) => {
                    const badge = getNotificationBadge(item.type);
                    const BadgeIcon = badge.icon;
                    const actorName = item.actor?.name || 'Someone';

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleNotificationClick(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNotificationClick(item);
                          }
                        }}
                        className={cn(
                          'relative flex items-center gap-3.5 px-4 py-3 sm:px-6 cursor-pointer transition-colors group select-none',
                          !item.isRead
                            ? 'bg-primary-50/50 dark:bg-primary-950/20 hover:bg-[#e4e6eb]/60 dark:hover:bg-[#3a3b3c]'
                            : 'bg-white hover:bg-[#f0f2f5] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]'
                        )}
                      >
                        {/* Avatar with badge */}
                        <div className="relative shrink-0">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#e4e6eb] dark:bg-[#3a3b3c] flex items-center justify-center text-[#050505] dark:text-[#e4e6eb] font-bold text-base shadow-xs">
                            {item.actor?.avatarUrl ? (
                              <Image
                                src={item.actor.avatarUrl}
                                alt={actorName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <span>{actorName.charAt(0).toUpperCase()}</span>
                            )}
                          </div>

                          <span
                            className={cn(
                              'absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white dark:ring-[#242526]',
                              badge.bgColor,
                              badge.textColor
                            )}
                          >
                            <BadgeIcon className="h-3 w-3 stroke-[2.5]" />
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm text-[#050505] dark:text-[#e4e6eb] leading-snug">
                            <span className="font-bold">{actorName}</span>{' '}
                            <span>{item.message}</span>
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={cn(
                                'text-xs',
                                !item.isRead
                                  ? 'font-bold text-primary-600 dark:text-primary-400'
                                  : 'text-[#65676b] dark:text-[#b0b3b8]'
                              )}
                            >
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {!item.isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-[#65676b] dark:text-[#b0b3b8] transition-all"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
      </Container>
    </div>
  );
}
