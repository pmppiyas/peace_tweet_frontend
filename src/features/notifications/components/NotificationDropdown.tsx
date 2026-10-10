'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
  className?: string;
}

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

export function NotificationDropdown({
  isOpen,
  onClose,
  triggerRef,
  className,
}: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL');

  // Fetch all notifications and keep in client cache
  const { data: notificationsData, isLoading } = useNotifications(
    undefined,
    isOpen
  );

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

  // Instant client-side filtering without any refetching or loading spinner
  const displayedNotifications = useMemo(() => {
    if (activeFilter === 'UNREAD') {
      return allNotifications.filter((item) => !item.isRead);
    }
    return allNotifications;
  }, [activeFilter, allNotifications]);

  // Handle click outside & escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }

    onClose();

    // Determine target route based on notification type and entity
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
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEffects.playDelete();
    deleteMutation.mutate(id);
  };

  return (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-label="Notifications"
      className={cn(
        'absolute right-0 top-full mt-2.5 z-50',
        'w-[360px] sm:w-[410px] max-w-[calc(100vw-1.5rem)]',
        'bg-white dark:bg-[#242526]',
        'rounded-2xl shadow-2xl',
        'border border-[#e4e6eb] dark:border-[#393a3b]',
        'flex flex-col overflow-hidden',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        className
      )}
      style={{ maxHeight: 'calc(100vh - 80px)' }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#050505] dark:text-[#e4e6eb]">
          Notifications
        </h2>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markAllAsReadMutation.isPending}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50"
            title="Mark all as read"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs: All / Unread */}
      <div className="flex items-center gap-2 px-4 pb-2.5 border-b border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={cn(
            'px-3.5 py-1 rounded-full text-sm font-semibold transition-all',
            activeFilter === 'ALL'
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
              : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
          )}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('UNREAD')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold transition-all',
            activeFilter === 'UNREAD'
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
              : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
          )}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification List Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
        {isLoading && allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#65676b] dark:text-[#b0b3b8] gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary-500" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-[#65676b] dark:text-[#b0b3b8]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f2f5] dark:bg-[#3a3b3c] mb-3">
              <Inbox className="h-7 w-7 stroke-[1.5]" />
            </div>
            <p className="font-semibold text-[#050505] dark:text-[#e4e6eb] text-sm">
              {activeFilter === 'UNREAD'
                ? 'No unread notifications'
                : 'No notifications yet'}
            </p>
            <p className="text-xs mt-1 text-[#65676b] dark:text-[#b0b3b8] max-w-xs">
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
                  'relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors group select-none',
                  !item.isRead
                    ? 'bg-primary-50/40 dark:bg-primary-950/20 hover:bg-[#e4e6eb]/60 dark:hover:bg-[#3a3b3c]'
                    : 'hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                )}
              >
                {/* Left: Avatar with type badge */}
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

                  {/* Badged action icon */}
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

                {/* Center: Notification Message and Relative Time */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-sm text-[#050505] dark:text-[#e4e6eb] leading-snug line-clamp-3">
                    <span className="font-semibold">{actorName}</span>{' '}
                    <span>{item.message}</span>
                  </p>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={cn(
                        'text-xs',
                        !item.isRead
                          ? 'font-semibold text-primary-600 dark:text-primary-400'
                          : 'text-[#65676b] dark:text-[#b0b3b8]'
                      )}
                    >
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right: Unread Blue Indicator & Action */}
                <div className="flex items-center gap-1 shrink-0">
                  {!item.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                  )}

                  {/* Delete button appears on item hover */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-[#65676b] dark:text-[#b0b3b8] transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#e4e6eb]/60 dark:border-[#393a3b]/60 px-4 py-2.5 bg-[#f7f8fa]/50 dark:bg-[#18191a]/40 flex items-center justify-between text-xs text-[#65676b] dark:text-[#b0b3b8]">
        <Link
          href={ROUTES.FRIENDS.REQUESTS}
          onClick={onClose}
          className="flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>Friend requests</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
        <span>PeaceTweet Notifications</span>
      </div>
    </div>
  );
}
