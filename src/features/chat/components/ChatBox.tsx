'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Check,
  CheckCheck,
  Smile,
  Loader2,
  Pencil,
  Trash2,
  Ban,
  MoreVertical,
} from 'lucide-react';
import { ActiveChat } from '../types/chat.types';
import { useChatMessages } from '../hooks/useChatMessages';
import { useGetOrCreateConversation } from '../hooks/useConversations';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

interface ChatBoxProps {
  activeChat: ActiveChat;
}

export function ChatBox({ activeChat }: ChatBoxProps) {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const closeChat = useChatStore((state) => state.closeChat);
  const toggleMinimize = useChatStore((state) => state.toggleMinimize);
  const isUserOnline = useChatStore((state) => state.isUserOnline);
  const typingMap = useChatStore((state) => state.typingMap);

  const [text, setText] = useState('');
  const [actualConversationId, setActualConversationId] = useState<string>(
    activeChat.conversationId.startsWith('temp_') ? '' : activeChat.conversationId,
  );

  const { mutateAsync: getOrCreateConv } = useGetOrCreateConversation();
  const isOnline = isUserOnline(activeChat.user.id);
  const typingStatus = actualConversationId
    ? typingMap[actualConversationId]
    : undefined;
  const isOtherUserTyping = Boolean(typingStatus?.isTyping);

  // Initialize or fetch conversation if temp
  useEffect(() => {
    if (!actualConversationId && activeChat.user.id) {
      getOrCreateConv(activeChat.user.id)
        .then((conv) => {
          if (conv?.id) {
            setActualConversationId(conv.id);
          }
        })
        .catch(() => {});
    }
  }, [actualConversationId, activeChat.user.id, getOrCreateConv]);

  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    editMessage,
    isEditing,
    deleteMessage,
    isDeleting,
    handleTyping,
    markAsRead,
  } = useChatMessages(actualConversationId, activeChat.user.id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Inline editing state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Facebook-style 3-dot menu state
  const [menuOpenMessageId, setMenuOpenMessageId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpenMessageId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.message-actions-menu')) {
          setMenuOpenMessageId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenMessageId]);

  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);

  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (messageId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed || isEditing) return;
    try {
      await editMessage(messageId, trimmed);
      setEditingMessageId(null);
      setEditingText('');
    } catch (err) {
      console.error('Failed to edit message:', err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const confirmPrompt =
      locale === 'bn'
        ? 'আপনি কি নিশ্চিত যে মেসেজটি মুছে ফেলতে (আনসেন্ড করতে) চান?'
        : 'Are you sure you want to unsend this message?';
    if (window.confirm(confirmPrompt)) {
      try {
        await deleteMessage(messageId);
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  };

  // Scroll to bottom on new messages or typing
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, isOtherUserTyping]);

  // Mark as read when opened or focused
  useEffect(() => {
    if (!activeChat.isMinimized && actualConversationId) {
      markAsRead();
    }
  }, [activeChat.isMinimized, actualConversationId, markAsRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    handleTyping(val);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setText('');
    try {
      const sent = await sendMessage(trimmed);
      if (sent?.conversationId && !actualConversationId) {
        setActualConversationId(sent.conversationId);
      }
      setTimeout(() => scrollToBottom('smooth'), 50);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Restore unsent text on failure
      setText(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sendQuickSalam = async () => {
    const salamText = 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ্';
    try {
      const sent = await sendMessage(salamText);
      if (sent?.conversationId && !actualConversationId) {
        setActualConversationId(sent.conversationId);
      }
      setTimeout(() => scrollToBottom('smooth'), 50);
    } catch (err) {
      console.error('Failed to send salam:', err);
    }
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

  // 1. Minimized View (Chat Pill / Header Dock)
  if (activeChat.isMinimized) {
    return (
      <div
        onClick={() => toggleMinimize(activeChat.user.id)}
        className="w-56 sm:w-64 bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] rounded-t-2xl shadow-xl flex items-center justify-between p-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2d2e2f] transition-all select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-xs">
              {activeChat.user.avatarUrl ? (
                <Image
                  src={activeChat.user.avatarUrl}
                  alt={activeChat.user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{activeChat.user.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-[#242526]" />
            )}
          </div>
          <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
            {activeChat.user.name}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#65676b] dark:text-[#b0b3b8]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize(activeChat.user.id);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
            title="Expand"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(activeChat.user.id);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Full Active Chat Box View
  return (
    <div className="w-[320px] sm:w-[340px] h-[430px] bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="p-2.5 sm:px-3 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between bg-white dark:bg-[#242526] z-10 shadow-2xs">
        <Link
          href={ROUTES.USER_PROFILE(activeChat.user.username)}
          className="flex items-center gap-2 min-w-0 group"
          title={`View @${activeChat.user.username}`}
        >
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-xs">
              {activeChat.user.avatarUrl ? (
                <Image
                  src={activeChat.user.avatarUrl}
                  alt={activeChat.user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{activeChat.user.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-[#242526]" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate group-hover:underline">
              {activeChat.user.name}
            </p>
            <p className="text-[11px] truncate leading-tight">
              {isOtherUserTyping ? (
                <span className="text-primary-600 dark:text-primary-400 font-semibold animate-pulse">
                  {locale === 'bn' ? 'টাইপ করছেন...' : 'typing...'}
                </span>
              ) : isOnline ? (
                <span className="text-emerald-500 font-medium">
                  {locale === 'bn' ? 'সক্রিয় আছেন' : 'Active now'}
                </span>
              ) : (
                <span className="text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn' ? 'অফলাইন' : 'Offline'}
                </span>
              )}
            </p>
          </div>
        </Link>

        {/* Header Controls */}
        <div className="flex items-center gap-1 text-[#65676b] dark:text-[#b0b3b8]">
          <button
            type="button"
            onClick={() => toggleMinimize(activeChat.user.id)}
            className="p-1.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => closeChat(activeChat.user.id)}
            className="p-1.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message List Body */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2 bg-[#f8f9fa] dark:bg-[#18191a]"
        onClick={() => inputRef.current?.focus()}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Welcome State */
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2.5 p-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden bg-primary-500 text-white font-bold flex items-center justify-center text-xl shadow-md">
              {activeChat.user.avatarUrl ? (
                <Image
                  src={activeChat.user.avatarUrl}
                  alt={activeChat.user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{activeChat.user.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-[#050505] dark:text-[#e4e6eb]">
                {activeChat.user.name}
              </p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                {locale === 'bn'
                  ? 'আপনারা পিসটুইটে সংযুক্ত আছেন'
                  : 'You are connected on PeaceTweet'}
              </p>
            </div>
            <button
              type="button"
              onClick={sendQuickSalam}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-bold transition-all shadow-2xs border border-primary-200/60 dark:border-primary-800/60 active:scale-95 cursor-pointer"
            >
              <span>👋 আসসালামু আলাইকুম পাঠান</span>
            </button>
          </div>
        ) : (
          /* Render Messages */
          messages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            const isLastMessage = index === messages.length - 1;
            const isCurrentlyEditing = editingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col group relative my-0.5',
                  isMe ? 'items-end' : 'items-start',
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-1 max-w-[88%]',
                    isMe ? 'flex-row-reverse' : 'flex-row',
                  )}
                >
                  {/* Sender Action Buttons (Facebook-style 3-dot hover trigger) */}
                  {isMe && !msg.isDeleted && !isCurrentlyEditing && (
                    <div
                      className={cn(
                        'relative flex items-center shrink-0 transition-opacity message-actions-menu',
                        menuOpenMessageId === msg.id
                          ? 'opacity-100 z-30'
                          : 'opacity-0 group-hover:opacity-100',
                      )}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenMessageId((prev) =>
                            prev === msg.id ? null : msg.id,
                          );
                        }}
                        className={cn(
                          'p-1.5 rounded-full transition-colors cursor-pointer text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb]',
                          menuOpenMessageId === msg.id &&
                            'bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]',
                        )}
                        title={locale === 'bn' ? 'আরও অপশন' : 'More'}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu - Facebook style: 1 option (Edit) */}
                      {menuOpenMessageId === msg.id && (
                        <div
                          className={cn(
                            'absolute z-40 min-w-[120px] bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl shadow-xl p-1 animate-in fade-in-0 zoom-in-95 duration-100',
                            index < 2 ? 'top-full mt-1' : 'bottom-full mb-1',
                            'right-0',
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenMessageId(null);
                              handleStartEdit(msg.id, msg.text);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer text-left"
                          >
                            <Pencil className="h-3.5 w-3.5 text-[#65676b] dark:text-[#b0b3b8]" />
                            <span>{locale === 'bn' ? 'এডিট করুন' : 'Edit'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble or Inline Edit Mode */}
                  {isCurrentlyEditing ? (
                    <div className="flex items-center gap-1.5 bg-white dark:bg-[#2d2e2f] border border-primary-500 rounded-2xl px-2.5 py-1 shadow-md w-full min-w-[200px]">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit(msg.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        className="flex-1 bg-transparent text-xs sm:text-[13px] text-[#050505] dark:text-[#e4e6eb] border-none outline-hidden py-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(msg.id)}
                        disabled={!editingText.trim() || isEditing}
                        className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                        title={locale === 'bn' ? 'সংরক্ষণ' : 'Save'}
                      >
                        {isEditing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1 text-[#65676b] hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
                        title={locale === 'bn' ? 'বাতিল' : 'Cancel'}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'px-3.5 py-2 text-xs sm:text-[13px] leading-relaxed break-words shadow-2xs transition-all',
                        msg.isDeleted
                          ? 'bg-gray-100 dark:bg-[#2a2b2c] text-gray-500 dark:text-gray-400 italic rounded-2xl border border-dashed border-gray-300 dark:border-gray-700'
                          : isMe
                          ? 'bg-primary-600 text-white rounded-2xl rounded-br-xs'
                          : 'bg-white dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] border border-[#e4e6eb] dark:border-transparent rounded-2xl rounded-bl-xs',
                      )}
                    >
                      {msg.isDeleted ? (
                        <span className="flex items-center gap-1.5 opacity-85 select-none text-[11px] sm:text-xs">
                          <Ban className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>
                            {locale === 'bn'
                              ? 'মেসেজটি মুছে ফেলা হয়েছে'
                              : 'This message was unsent'}
                          </span>
                        </span>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-meta: Always visible time + (edited) tag + Delivery/Seen status */}
                <div
                  className={cn(
                    'flex items-center gap-1 text-[10px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 select-none px-1',
                    isMe ? 'justify-end' : 'justify-start',
                  )}
                >
                  <span>{formatMessageTime(msg.createdAt)}</span>

                  {msg.isEdited && !msg.isDeleted && (
                    <span className="text-[9px] text-[#65676b] dark:text-[#b0b3b8]">
                      • {locale === 'bn' ? 'সম্পাদিত' : 'edited'}
                    </span>
                  )}

                  {/* Delivery & Seen Status for Sender */}
                  {isMe && !msg.isDeleted && (
                    <span className="flex items-center gap-0.5 ml-0.5">
                      {msg.isRead ? (
                        <span
                          className="flex items-center gap-0.5 text-primary-500 font-medium"
                          title={locale === 'bn' ? 'দেখা হয়েছে (Seen)' : 'Seen'}
                        >
                          <CheckCheck className="h-3 w-3 stroke-[2.2]" />
                          {isLastMessage && (
                            <span>{locale === 'bn' ? 'দেখা হয়েছে' : 'Seen'}</span>
                          )}
                        </span>
                      ) : (
                        <span
                          className="flex items-center gap-0.5 text-gray-400 dark:text-gray-500"
                          title={locale === 'bn' ? 'পৌঁছেছে (Delivered)' : 'Delivered'}
                        >
                          <CheckCheck className="h-3 w-3 stroke-[1.8]" />
                          {isLastMessage && (
                            <span>{locale === 'bn' ? 'পৌঁছেছে' : 'Delivered'}</span>
                          )}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Sending message indicator */}
        {isSending && (
          <div className="flex items-center justify-end gap-1 text-[10px] text-[#65676b] dark:text-[#b0b3b8] pr-1">
            <Loader2 className="h-3 w-3 animate-spin text-primary-500" />
            <span>{locale === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
          </div>
        )}

        {/* Typing indicator bubble */}
        {isOtherUserTyping && (
          <div className="flex items-center gap-1.5 pt-1">
            <div className="bg-white dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-transparent rounded-2xl rounded-bl-xs px-3 py-2 shadow-2xs flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#65676b] dark:bg-[#b0b3b8] animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-[#65676b] dark:bg-[#b0b3b8] animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-[#65676b] dark:bg-[#b0b3b8] animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={handleSend}
        className="p-2 border-t border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] flex items-center gap-1.5"
      >
        <button
          type="button"
          onClick={() => {
            setText((prev) => prev + ' 🤲 ');
            inputRef.current?.focus();
          }}
          className="p-2 text-[#65676b] hover:text-[#050505] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
          title="Dua Emoji"
        >
          <Smile className="h-4 w-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={markAsRead}
          placeholder={
            locale === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'
          }
          className="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full py-1.5 px-3.5 text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] border-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className={cn(
            'p-2 rounded-full transition-all shrink-0',
            text.trim() && !isSending
              ? 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/60 cursor-pointer active:scale-90'
              : 'text-gray-400 cursor-not-allowed opacity-50',
          )}
          title={locale === 'bn' ? 'পাঠান' : 'Send'}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
          ) : (
            <Send className="h-4 w-4 stroke-[2.25]" />
          )}
        </button>
      </form>
    </div>
  );
}
