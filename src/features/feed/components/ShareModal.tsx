'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useShare } from '../hooks/useShare';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { useAuth } from '@/hooks/useAuth';
import {
  Globe,
  Users,
  Check,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import { ShareContentType, ShareTarget } from '../types/feed.types';

export interface SharePreviewData {
  id: string;
  title?: string;
  content?: string | null;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string | null;
  type?: string;
  mediaUrls?: string[];
  duaMeaning?: string;
  bloodGroup?: string;
  hospitalName?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ShareContentType;
  contentId: string;
  previewData?: SharePreviewData;
}

export function ShareModal({
  isOpen,
  onClose,
  contentType,
  contentId,
}: ShareModalProps) {
  const { user } = useAuth();
  const { shareSync, isSharing } = useShare();
  const { data: myGroupsData, isLoading: isLoadingGroups } = useMyGroups({ limit: 50 });

  const [target, setTarget] = useState<ShareTarget>('FEED');
  const [caption, setCaption] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flatten groups
  const groups = myGroupsData?.pages.flatMap((page) => page.items) || [];
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const getCanonicalUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    if (contentType === 'DUA') return `${origin}/duas/${contentId}`;
    if (contentType === 'BLOOD_REQUEST') return `${origin}/blood/${contentId}`;
    return `${origin}/posts/${contentId}`;
  };

  // Copy link: Copies directly to clipboard WITHOUT any DB upload or count
  const handleCopyLink = async () => {
    const url = getCanonicalUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setStatusMessage('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setStatusMessage(null);
      }, 2500);
    } catch {
      setErrorMessage('Failed to copy link.');
    }
  };

  const handleWhatsAppShare = () => {
    const url = getCanonicalUrl();
    const text = caption.trim() ? `${caption}\n\n${url}` : url;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleMessengerShare = () => {
    const url = getCanonicalUrl();
    window.open(
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=1809358616902969&redirect_uri=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleShareSubmit = () => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (target === 'GROUP' && !selectedGroupId) {
      setErrorMessage('Please select a group to share this post.');
      return;
    }

    const payload = {
      contentType,
      contentId,
      target,
      groupId: target === 'GROUP' ? selectedGroupId : undefined,
      caption: caption.trim() || undefined,
    };

    // Close modal immediately so user doesn't wait
    onClose();
    setCaption('');

    // Trigger instant background share & Kafka pipeline
    shareSync(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 overflow-hidden rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b]"
    >
      {/* 1. Modal Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <h2 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
          Share to
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* 2. Top: User Meta & Destination Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            {user?.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name || 'User'} fill className="object-cover" />
            ) : (
              <span>{user?.name?.[0] || 'U'}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
              {user?.name || 'You'}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f2f5] px-2.5 py-0.5 text-[11px] font-medium text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]">
              {target === 'FEED' ? (
                <>
                  <Globe className="h-3 w-3 shrink-0" />
                  <span>Public Feed</span>
                </>
              ) : (
                <>
                  <Users className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {selectedGroup ? selectedGroup.name : 'Group'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. Top: Caption Input */}
        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something about this..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] p-3 text-sm text-[#050505] placeholder-[#65676b] outline-none transition-colors focus:border-primary-500 focus:bg-white dark:border-[#393a3b] dark:bg-[#18191a] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:border-primary-500"
          />
        </div>

        {/* 4. Feedback Messages */}
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 5. "Share to" Section: Authentic Circular Buttons Row */}
        <div className="pt-1">
          <h3 className="mb-3 text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
            Share to
          </h3>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {/* 1. Feed Button */}
            <button
              type="button"
              onClick={() => {
                setTarget('FEED');
                setErrorMessage(null);
              }}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div
                className={cn(
                  'h-14 w-14 shrink-0 rounded-full flex items-center justify-center transition-all',
                  target === 'FEED'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50]',
                )}
              >
                {/* News feed / Story icon */}
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  <path d="M14 14H7v2h7v-2zm3-4H7v2h10v-2zm0-4H7v2h10V6z"/>
                </svg>
              </div>
              <span
                className={cn(
                  'text-[12px] font-medium text-center leading-tight truncate w-full',
                  target === 'FEED'
                    ? 'font-bold text-primary-600 dark:text-primary-400'
                    : 'text-[#050505] dark:text-[#e4e6eb]',
                )}
              >
                Your feed
              </span>
            </button>

            {/* 2. Group Button */}
            <button
              type="button"
              onClick={() => {
                setTarget('GROUP');
                setErrorMessage(null);
              }}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div
                className={cn(
                  'h-14 w-14 shrink-0 rounded-full flex items-center justify-center transition-all',
                  target === 'GROUP'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50]',
                )}
              >
                {/* 3 People Group Silhouette */}
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <span
                className={cn(
                  'text-[12px] font-medium text-center leading-tight truncate w-full',
                  target === 'GROUP'
                    ? 'font-bold text-primary-600 dark:text-primary-400'
                    : 'text-[#050505] dark:text-[#e4e6eb]',
                )}
              >
                Group
              </span>
            </button>

            {/* 3. Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div
                className={cn(
                  'h-14 w-14 shrink-0 rounded-full flex items-center justify-center transition-all',
                  copied
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50]',
                )}
              >
                {copied ? (
                  <Check className="h-6 w-6 stroke-[2.5]" />
                ) : (
                  /* Chain Link Icon */
                  <svg
                    className="h-6 w-6 fill-none stroke-current"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  'text-[12px] font-medium text-center leading-tight truncate w-full',
                  copied
                    ? 'font-bold text-emerald-600 dark:text-emerald-400'
                    : 'text-[#050505] dark:text-[#e4e6eb]',
                )}
              >
                {copied ? 'Copied!' : 'Copy link'}
              </span>
            </button>

            {/* 4. WhatsApp Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div className="h-14 w-14 shrink-0 rounded-full bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] flex items-center justify-center transition-all">
                {/* Official WhatsApp Shape */}
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.15c-.24.68-1.39 1.3-1.94 1.37-.52.07-1.18.1-3.46-.85-2.73-1.13-4.47-3.92-4.61-4.1-.14-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.27.25-.27.55-.34.73-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.11.3.02.48-.09.18-.14.29-.27.45-.14.16-.29.35-.41.47-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.04.93 1.92 1.22 2.19 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.66-.17 1.34z"/>
                </svg>
              </div>
              <span className="text-[12px] font-medium text-center text-[#050505] dark:text-[#e4e6eb] truncate w-full">
                WhatsApp
              </span>
            </button>

            {/* 5. Messenger Button */}
            <button
              type="button"
              onClick={handleMessengerShare}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div className="h-14 w-14 shrink-0 rounded-full bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] flex items-center justify-center transition-all">
                {/* Official Messenger Lightning Bubble Shape */}
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.03 2 11.2c0 2.94 1.45 5.56 3.73 7.28V22l3.37-1.85c.92.26 1.89.4 2.9.4 5.52 0 10-4.03 10-9.35S17.52 2 12 2zm1.07 12.43-2.72-2.9-5.3 2.9 5.83-6.19 2.78 2.9 5.24-2.9-5.83 6.19z"/>
                </svg>
              </div>
              <span className="text-[12px] font-medium text-center text-[#050505] dark:text-[#e4e6eb] truncate w-full">
                Messenger
              </span>
            </button>
          </div>
        </div>

        {/* 6. Group Picker (Expands only when Group is selected) */}
        {target === 'GROUP' && (
          <div className="rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] p-3.5 space-y-3 dark:border-[#393a3b] dark:bg-[#18191a] animate-in fade-in duration-150">
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
              Select a Group to Share to:
            </label>

            {isLoadingGroups ? (
              <div className="flex items-center gap-2 p-2 text-xs text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading your groups...</span>
              </div>
            ) : groups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#e4e6eb] p-3 text-center text-xs text-[#65676b] dark:border-[#393a3b] dark:text-[#b0b3b8]">
                You have not joined any groups yet.
              </div>
            ) : (
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full rounded-xl border border-[#e4e6eb] bg-white p-2.5 text-xs font-semibold text-[#050505] outline-none focus:border-primary-500 dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
              >
                <option value="">-- Choose a Group --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.memberCount || 0} members)
                  </option>
                ))}
              </select>
            )}

            {/* Post Approval Notice if Group requires approval */}
            {selectedGroup && selectedGroup.requiresPostApproval && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-bold">Admin Approval Required</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                    This group requires moderation. Your post will be reviewed by group admins before it becomes visible to all members.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <button
            type="button"
            disabled={isSharing}
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSharing || (target === 'GROUP' && !selectedGroupId)}
            onClick={handleShareSubmit}
            className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition-all shadow-2xs"
          >
            {isSharing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Sharing...</span>
              </>
            ) : (
              <span>{target === 'GROUP' ? 'Share to Group' : 'Share Now'}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
