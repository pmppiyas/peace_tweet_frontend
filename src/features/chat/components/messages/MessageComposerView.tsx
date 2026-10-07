'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Check,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

interface MessageComposerViewProps {
  onSendMessage: (text: string) => Promise<unknown>;
  isSending: boolean;
  onTyping: (text: string) => void;
  editingMessageId: string | null;
  editingText: string;
  onSaveEdit: (messageId: string, newText: string) => Promise<unknown>;
  onCancelEdit: () => void;
}

const QUICK_EMOJIS = ['🤲', '🕊️', '❤️', '👍', '😊', '🌸', '👏', '🎉', '🤍'];

export function MessageComposerView({
  onSendMessage,
  isSending,
  onTyping,
  editingMessageId,
  editingText,
  onSaveEdit,
  onCancelEdit,
}: MessageComposerViewProps) {
  const { locale } = useLanguage();
  const [text, setText] = useState('');
  const [editText, setEditText] = useState(editingText);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentNotice, setAttachmentNotice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync editing text
  useEffect(() => {
    setEditText(editingText);
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
    }
  }, [editingMessageId, editingText]);

  // Adjust textarea height dynamically
  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    onTyping(val);
    adjustHeight(e.target);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setShowEmojiPicker(false);

    try {
      await onSendMessage(trimmed);
    } catch (err) {
      console.error('Failed to send message:', err);
      setText(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveEditSubmit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || !editingMessageId) return;

    try {
      await onSaveEdit(editingMessageId, trimmed);
    } catch (err) {
      console.error('Failed to save edit:', err);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEditSubmit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const handleAddEmoji = (emoji: string) => {
    if (editingMessageId) {
      setEditText((prev) => prev + emoji);
    } else {
      const next = text + emoji;
      setText(next);
      onTyping(next);
    }
  };

  const sendQuickSalam = () => {
    const salamText = 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ্';
    onSendMessage(salamText).catch(console.error);
  };

  const handleAttachmentClick = () => {
    setAttachmentNotice(true);
    setTimeout(() => setAttachmentNotice(false), 2500);
  };

  return (
    <footer className="border-t border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] p-2.5 sm:p-3 pb-safe shrink-0">
      {/* Quick Emoji Bar (Collapsible) */}
      {showEmojiPicker && (
        <div className="flex items-center gap-1.5 px-2 py-2 mb-2 bg-[#f0f2f5] dark:bg-[#18191a] rounded-xl overflow-x-auto select-none animate-in fade-in zoom-in-95 duration-100">
          <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] px-1 shrink-0">
            {locale === 'bn' ? 'ইমোজি:' : 'Emojis:'}
          </span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-lg p-1 hover:scale-125 transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Info Notice */}
      {attachmentNotice && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-semibold text-primary-700 dark:text-primary-300 animate-in fade-in duration-150">
          {locale === 'bn'
            ? 'ফাইল ও ইমেজ সংযুক্তি শীঘ্রই উপলব্ধ হবে।'
            : 'File and image attachments will be available in the next release.'}
        </div>
      )}

      {/* Inline Editing Mode Banner */}
      {editingMessageId ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
            <span>{locale === 'bn' ? 'মেসেজ এডিট করা হচ্ছে' : 'Editing message'}</span>
            <button
              type="button"
              onClick={onCancelEdit}
              className="p-1 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              ref={editTextareaRef}
              rows={1}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                adjustHeight(e.target);
              }}
              onKeyDown={handleEditKeyDown}
              className="flex-1 max-h-32 min-h-[38px] rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3.5 py-2 text-sm text-[#050505] dark:text-[#e4e6eb] outline-hidden focus:ring-2 focus:ring-primary-500 resize-none transition-all"
            />
            <button
              type="button"
              onClick={handleSaveEditSubmit}
              disabled={!editText.trim()}
              className="p-2.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Regular Message Composer */
        <div className="space-y-2">
          {/* Quick Salam Pill when empty */}
          {!text.trim() && (
            <div className="flex items-center gap-2 select-none overflow-x-auto [scrollbar-width:none]">
              <button
                type="button"
                onClick={sendQuickSalam}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40 hover:bg-primary-100 hover:scale-[1.02] text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                <span>আসসালামু আলাইকুম</span>
              </button>
            </div>
          )}

          <div className="flex items-end gap-1.5 sm:gap-2">
            {/* Attachment Button (Prepared architecture) */}
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="p-2 sm:p-2.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb] transition-colors shrink-0 cursor-pointer"
              title={locale === 'bn' ? 'সংযুক্তি যোগ করুন' : 'Attach file'}
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Emoji Tray Toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className={cn(
                'p-2 sm:p-2.5 rounded-full transition-colors shrink-0 cursor-pointer',
                showEmojiPicker
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400'
                  : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb]',
              )}
              title={locale === 'bn' ? 'ইমোজি' : 'Emoji'}
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Multiline Message Textarea */}
            <div className="flex-1 relative flex items-center">
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  locale === 'bn'
                    ? 'শান্তিপূর্ণ মেসেজ লিখুন... (Enter পাঠাতে)'
                    : 'Write a peaceful message... (Enter to send)'
                }
                className="w-full max-h-32 min-h-[40px] rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c] px-4 py-2.5 text-sm text-[#050505] dark:text-[#e4e6eb] placeholder-[#65676b] dark:placeholder-[#b0b3b8] outline-hidden focus:ring-2 focus:ring-primary-500 resize-none transition-all leading-normal"
              />
            </div>

            {/* Send Action Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className={cn(
                'p-2.5 sm:p-3 rounded-full font-bold flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs',
                text.trim() && !isSending
                  ? 'bg-primary-500 hover:bg-primary-600 text-white scale-100 hover:scale-105 active:scale-95'
                  : 'bg-primary-200 dark:bg-primary-950/50 text-primary-400 cursor-not-allowed opacity-50',
              )}
              title={locale === 'bn' ? 'মেসেজ পাঠান' : 'Send'}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
