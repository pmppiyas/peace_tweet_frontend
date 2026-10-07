'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatAvatar } from '../ChatAvatar';
import {
  Check,
  CheckCheck,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Ban,
} from 'lucide-react';
import { ChatMessage, ChatUser } from '@/features/chat/types/chat.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

interface MessageFeedItemProps {
  message: ChatMessage;
  isMe: boolean;
  showAvatar?: boolean;
  showTimestampHeader?: boolean;
  otherUser?: ChatUser;
  onStartEdit: (messageId: string, currentText: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export function MessageFeedItem({
  message,
  isMe,
  showAvatar = true,
  showTimestampHeader = false,
  otherUser,
  onStartEdit,
  onDeleteMessage,
}: MessageFeedItemProps) {
  const { locale } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setIsMenuOpen(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMessageTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatHeaderDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return locale === 'bn' ? 'আজ' : 'Today';

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return locale === 'bn' ? 'গতকাল' : 'Yesterday';
    }

    return date.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const isTemp = message.id.startsWith('temp_');
  const otherName = otherUser?.name || message.sender?.name || 'User';
  const otherLetter = otherName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className="space-y-2">
      {/* Date Header Separator */}
      {showTimestampHeader && (
        <div className="flex items-center justify-center my-3 select-none">
          <span className="px-3 py-1 rounded-full bg-[#e4e6eb]/80 dark:bg-[#393a3b]/80 text-[11px] font-semibold text-[#65676b] dark:text-[#b0b3b8] shadow-2xs">
            {formatHeaderDate(message.createdAt)}
          </span>
        </div>
      )}

      {/* Message Row */}
      <div
        className={cn(
          'flex items-end gap-2 group relative',
          isMe ? 'justify-end' : 'justify-start',
        )}
      >
        {/* Other User Avatar (shown only when needed) */}
        {!isMe && (
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            {showAvatar ? (
              <ChatAvatar
                src={otherUser?.avatarUrl || message.sender?.avatarUrl}
                name={otherName}
                size="xs"
              />
            ) : (
              <div className="w-8" />
            )}
          </div>
        )}

        {/* Action Controls on Hover (Left of Me, Right of Other) */}
        {isMe && !message.isDeleted && !isTemp && (
          <div
            ref={menuRef}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 select-none relative"
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb] transition-colors cursor-pointer"
              title="Message options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Menu Popover */}
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-36 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'কপি করুন' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onStartEdit(message.id, message.text);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'এডিট করুন' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteMessage(message.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'max-w-[78%] sm:max-w-[70%] px-3.5 py-2 text-sm leading-relaxed shadow-2xs break-words relative transition-all',
            isMe
              ? 'bg-primary-500 text-white rounded-2xl rounded-br-xs'
              : 'bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] rounded-2xl rounded-bl-xs',
            message.isDeleted && 'italic opacity-60 bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700',
            isTemp && 'opacity-70',
          )}
        >
          {message.isDeleted ? (
            <div className="flex items-center gap-1.5 text-xs">
              <Ban className="h-3.5 w-3.5 text-gray-400" />
              <span>
                {locale === 'bn'
                  ? 'মেসেজটি মুছে ফেলা হয়েছে'
                  : 'This message was deleted'}
              </span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
          )}

          {/* Timestamp & Meta Information inside Bubble */}
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-[10px] select-none',
              isMe
                ? 'justify-end text-white/80'
                : 'justify-end text-[#65676b] dark:text-[#b0b3b8]',
            )}
          >
            {message.isEdited && !message.isDeleted && (
              <span className="italic">
                {locale === 'bn' ? '(সম্পাদিত)' : '(edited)'}
              </span>
            )}
            <span>{formatMessageTime(message.createdAt)}</span>

            {/* Read / Sent Status ticks for Me */}
            {isMe && !message.isDeleted && (
              <span className="inline-flex items-center">
                {isTemp ? (
                  <span className="h-2 w-2 rounded-full border border-white/80 border-t-transparent animate-spin ml-0.5" />
                ) : message.isRead ? (
                  <span title="Seen">
                    <CheckCheck className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                  </span>
                ) : (
                  <span title="Delivered">
                    <Check className="h-3.5 w-3.5 text-white/80 stroke-[2.2]" />
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls for Other User (Copy only) */}
        {!isMe && !message.isDeleted && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center shrink-0 select-none">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb] transition-colors cursor-pointer"
              title={copied ? 'Copied!' : 'Copy text'}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
