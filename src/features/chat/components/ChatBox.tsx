'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatAvatar } from './ChatAvatar';
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
  ArrowLeft,
} from 'lucide-react';
import { ActiveChat } from '../types/chat.types';
import { useChatMessages } from '../hooks/useChatMessages';
import { useGetOrCreateConversation } from '../hooks/useConversations';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';

interface ChatBoxProps {
  activeChat: ActiveChat;
  isMobileActive?: boolean;
}

export function ChatBox({ activeChat, isMobileActive = true }: ChatBoxProps) {
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

  const handleSaveEdit = (messageId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;
    setEditingMessageId(null);
    setEditingText('');
    editMessage(messageId, trimmed).catch((err) => {
      console.error('Failed to edit message:', err);
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    soundEffects.playDelete();
    // Instant delete without confirmation dialog
    deleteMessage(messageId).catch((err) => {
      console.error('Failed to delete message:', err);
    });
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

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setText('');
    sendMessage(trimmed)
      .then((sent) => {
        if (sent?.conversationId && !actualConversationId) {
          setActualConversationId(sent.conversationId);
        }
      })
      .catch((err) => {
        console.error('Failed to send message:', err);
        setText(trimmed);
      });

    setTimeout(() => scrollToBottom('smooth'), 20);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sendQuickSalam = () => {
    const salamText = 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ্';
    sendMessage(salamText)
      .then((sent) => {
        if (sent?.conversationId && !actualConversationId) {
          setActualConversationId(sent.conversationId);
        }
      })
      .catch((err) => {
        console.error('Failed to send salam:', err);
      });
    setTimeout(() => scrollToBottom('smooth'), 20);
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

  // 1. Minimized View (Rendered as Floating Chat Head in ChatDock)
  if (activeChat.isMinimized) {
    return null;
  }

  // 2. Full Active Chat Box View
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#18191a] sm:dark:bg-[#242526] flex flex-col overflow-hidden',
        // Mobile: Immersive full-screen Messenger view
        'fixed inset-0 z-50 w-full h-[100dvh]',
        // Desktop: Docked window at bottom-right with responsive md and lg scaling
        'sm:static sm:inset-auto sm:z-auto sm:w-[340px] sm:h-[460px] md:w-[365px] md:h-[500px] lg:w-[385px] lg:h-[520px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-[#e4e6eb] sm:dark:border-[#393a3b] sm:animate-in sm:slide-in-from-bottom-4 duration-150',
        !isMobileActive && 'hidden sm:flex',
      )}
    >
      {/* Header */}
      <div className="h-13 sm:h-12 px-3 sm:px-3.5 border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between bg-white dark:bg-[#242526] shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
          {/* Mobile Back Arrow to minimize back to floating head */}
          <button
            type="button"
            onClick={() => toggleMinimize(activeChat.user.id)}
            className="sm:hidden p-2 -ml-1 text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer"
            title={locale === 'bn' ? 'ফিরে যান' : 'Back'}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Link
            href={ROUTES.USER_PROFILE(activeChat.user.username)}
            className="flex items-center gap-2 min-w-0 group"
            title={`View @${activeChat.user.username}`}
          >
            <ChatAvatar
              src={activeChat.user.avatarUrl}
              name={activeChat.user.name}
              size="sm"
              isOnline={isOnline}
            />

            <div className="min-w-0">
              <p className="text-sm sm:text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate group-hover:underline">
                {activeChat.user.name}
              </p>
              <p className="text-xs sm:text-[11px] truncate leading-tight">
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
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1 text-[#65676b] dark:text-[#b0b3b8]">
          {/* Maximize to full page on desktop */}
          <Link
            href={
              actualConversationId
                ? `${ROUTES.MESSAGES}?conversationId=${actualConversationId}`
                : `${ROUTES.MESSAGES}?userId=${activeChat.user.id}`
            }
            className="hidden sm:flex p-1.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb]"
            title={locale === 'bn' ? 'মেসেজে বড় করুন' : 'Open in Messages'}
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => toggleMinimize(activeChat.user.id)}
            className="hidden sm:flex p-1.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb]"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => closeChat(activeChat.user.id)}
            className="p-2 sm:p-1.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb]"
            title="Close"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
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
            <ChatAvatar
              src={activeChat.user.avatarUrl}
              name={activeChat.user.name}
              size="xl"
            />
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

                      {/* Dropdown Menu - Facebook style: Edit & Delete */}
                      {menuOpenMessageId === msg.id && (
                        <div
                          className={cn(
                            'absolute z-40 min-w-[130px] bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl shadow-xl p-1 animate-in fade-in-0 zoom-in-95 duration-100',
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
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenMessageId(null);
                              handleDeleteMessage(msg.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{locale === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
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
                    'flex items-center gap-1 text-[11px] sm:text-[10px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 select-none px-1 whitespace-nowrap',
                    isMe ? 'justify-end' : 'justify-start',
                  )}
                >
                  <span>{formatMessageTime(msg.createdAt)}</span>

                  {msg.isEdited && !msg.isDeleted && (
                    <span className="text-[10px] sm:text-[9px]">
                      • {locale === 'bn' ? 'সম্পাদিত' : 'edited'}
                    </span>
                  )}

                  {/* Delivery & Seen Status for Sender */}
                  {isMe && !msg.isDeleted && (
                    <span className="inline-flex items-center gap-0.5 ml-0.5">
                      {msg.isRead ? (
                        <span
                          className="inline-flex items-center gap-0.5 text-primary-500 font-medium"
                          title={locale === 'bn' ? 'দেখা হয়েছে (Seen)' : 'Seen'}
                        >
                          <CheckCheck className="h-3 w-3 stroke-[2.2]" />
                          {isLastMessage && (
                            <span>{locale === 'bn' ? 'দেখা হয়েছে' : 'Seen'}</span>
                          )}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-0.5 text-gray-400 dark:text-gray-500"
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
        className="p-2 sm:p-2 border-t border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] flex items-center gap-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shrink-0 z-10"
      >
        <button
          type="button"
          onClick={() => {
            setText((prev) => prev + ' 🤲 ');
            inputRef.current?.focus();
          }}
          className="p-2 text-[#65676b] hover:text-[#050505] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] rounded-full transition-colors cursor-pointer shrink-0"
          title="Dua Emoji"
        >
          <Smile className="h-5 w-5 sm:h-4 sm:w-4" />
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
          className="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full py-2 sm:py-1.5 px-3.5 text-sm sm:text-xs text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] border-none focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className={cn(
            'h-9 w-9 rounded-full flex items-center justify-center transition-all shrink-0',
            text.trim() && !isSending
              ? 'bg-primary-500 text-white shadow-xs hover:bg-primary-600 active:scale-95 cursor-pointer'
              : 'text-gray-400 opacity-40 cursor-not-allowed',
          )}
          title={locale === 'bn' ? 'পাঠান' : 'Send'}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Send className="h-4 w-4 stroke-[2.25] -ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
}
