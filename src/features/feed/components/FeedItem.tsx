'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedItem as FeedItemType } from '../types/feed.types';
import { DuaPostCard } from './DuaPostCard';
import { TextPostCard } from './TextPostCard';
import { BloodPostCard } from './BloodPostCard';
import { QuestionPostCard } from './QuestionPostCard';
import { AnnouncementCard } from './AnnouncementCard';
import { usePostActions } from '../hooks/usePostActions';
import { useComments } from '../hooks/useComments';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/date';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { getFeelingById } from '../constants/feelings';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Globe,
  Send,
  Loader2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

interface FeedItemProps {
  post: FeedItemType;
}

export function FeedItem({ post }: FeedItemProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const { toggleReaction, toggleSave, deletePost, isDeletingPost } =
    usePostActions();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localShareCount, setLocalShareCount] = useState(post.stats.shareCount || 0);
  const feelingItem = getFeelingById(post.feeling);

  const {
    comments,
    isLoading: isLoadingComments,
    addComment,
    isAddingComment,
  } = useComments(post.id, showComments);

  const isAuthor = user?.id === post.author.id || user?.role === 'ADMIN';

  const handleShare = async () => {
    const postUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/posts/${post.id}`
        : '';
    const shareData = {
      title: post.dua?.title || 'PeaceTweet Post',
      text:
        post.content || post.dua?.meaningBangla || 'PeaceTweet Islamic Post',
      url: postUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setLocalShareCount((prev) => prev + 1);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(commentText.trim());
      setCommentText('');
    } catch {}
  };

  return (
    <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl overflow-hidden transition-all">
      {/* 1. Author & Post Meta Header */}
      <div className="p-3.5 sm:p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-sm shadow-xs select-none overflow-hidden">
              {(post.author.avatar || (isAuthor ? user?.avatarUrl : null)) ? (
                <Image
                  src={post.author.avatar || user?.avatarUrl || ''}
                  alt={post.author.name || 'User'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>
                  {post.author.name
                    ? post.author.name.charAt(0).toUpperCase()
                    : '🕊️'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[15px] text-[#050505] dark:text-[#e4e6eb]">
                  {post.author.name || 'PeaceTweet Scholar'}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-500 fill-primary-100 dark:fill-primary-900 shrink-0" />
                {feelingItem && (
                  <span className="text-xs text-[#65676b] dark:text-[#b0b3b8] font-normal flex items-center gap-1">
                    <span>is feeling</span>
                    <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                      {feelingItem.label}
                    </span>
                    <span className="text-sm">{feelingItem.emoji}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                <span>@{post.author.username || 'peacetweet'}</span>
                <span>•</span>
                <span>
                  {post.createdAt
                    ? formatDate(post.createdAt, locale)
                    : locale === 'bn'
                      ? 'আজ'
                      : 'Today'}
                </span>
                <span>•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {isAuthor && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1.5 rounded-full transition-colors"
                  title="Post Options"
                >
                  <MoreHorizontal className="h-4.5 w-4.5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-36 rounded-xl border border-[#e4e6eb] bg-white p-1 shadow-lg dark:border-[#393a3b] dark:bg-[#242526] z-20 animate-in fade-in duration-100">
                    <button
                      type="button"
                      disabled={isDeletingPost}
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Main Post Content Body */}
        <div className="mt-3">
          {post.type === 'DUA' && <DuaPostCard post={post} />}
          {post.type === 'BLOOD_REQUEST' && <BloodPostCard post={post} />}
          {post.type === 'QUESTION' && <QuestionPostCard post={post} />}
          {post.type === 'ANNOUNCEMENT' && <AnnouncementCard post={post} />}
          {post.type === 'TEXT' && <TextPostCard post={post} />}
        </div>

        {/* Category Hashtag Tag (Below Content) */}
        {post.dua?.category && (
          <div>
            <Link href={ROUTES.CATEGORY_DETAIL(post.dua.category.slug)}>
              <span className="inline-flex items-center text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-full dark:bg-primary-900/60 dark:text-primary-300 transition-colors">
                #{post.dua.category.name}
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Action Buttons Bar with Counts in a Single Line beside the Icons */}
      <div className="grid grid-cols-4 border-t border-[#e4e6eb] px-1 sm:px-2 py-1 text-xs font-semibold dark:border-[#393a3b]">
        {/* Reaction (LIKE / Ameen) */}
        <button
          type="button"
          onClick={() => toggleReaction(post.id, post.viewer.hasReacted)}
          className={cn(
            'flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg transition-colors select-none whitespace-nowrap',
            post.viewer.hasReacted
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]'
          )}
          title={`${post.stats.reactionCount || 0} reactions`}
        >
          <Heart
            className={cn(
              'h-4 w-4 shrink-0',
              post.viewer.hasReacted &&
                'fill-current text-rose-600 dark:text-rose-400'
            )}
          />
          <span className="truncate">
            {post.type === 'DUA'
              ? locale === 'bn'
                ? 'আমীন'
                : 'Ameen'
              : locale === 'bn'
                ? 'পছন্দ'
                : 'Like'}
          </span>
          <span className="text-[11px] font-bold opacity-80 shrink-0">
            ({post.stats.reactionCount || 0})
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg transition-colors select-none whitespace-nowrap',
            showComments
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]'
          )}
          title={`${post.stats.commentCount || 0} comments`}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="truncate">{locale === 'bn' ? 'মন্তব্য' : 'Comment'}</span>
          <span className="text-[11px] font-bold opacity-80 shrink-0">
            ({post.stats.commentCount || 0})
          </span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={() => toggleSave(post.id, post.viewer.hasSaved)}
          className={cn(
            'flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg transition-colors select-none whitespace-nowrap',
            post.viewer.hasSaved
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]'
          )}
          title={`${post.stats.saveCount || 0} saves`}
        >
          <Bookmark
            className={cn(
              'h-4 w-4 shrink-0',
              post.viewer.hasSaved &&
                'fill-current text-amber-600 dark:text-amber-400'
            )}
          />
          <span className="truncate">
            {post.viewer.hasSaved
              ? locale === 'bn'
                ? 'সংরক্ষিত'
                : 'Saved'
              : locale === 'bn'
                ? 'সেভ'
                : 'Save'}
          </span>
          <span className="text-[11px] font-bold opacity-80 shrink-0">
            ({post.stats.saveCount || 0})
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] rounded-lg transition-colors select-none whitespace-nowrap dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
          title={`${localShareCount} shares`}
        >
          <Share2 className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {copied
              ? locale === 'bn'
                ? 'কপি হয়েছে!'
                : 'Copied!'
              : locale === 'bn'
                ? 'শেয়ার'
                : 'Share'}
          </span>
          <span className="text-[11px] font-bold opacity-80 shrink-0">
            ({localShareCount})
          </span>
        </button>
      </div>

      {/* 5. Inline Comments Section */}
      {showComments && (
        <div className="border-t border-[#e4e6eb] bg-[#f0f2f5]/40 p-3.5 sm:p-4 space-y-3 dark:border-[#393a3b] dark:bg-[#3a3b3c]/20 animate-in fade-in duration-150">
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-xs select-none overflow-hidden shadow-xs">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}</span>
              )}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  locale === 'bn'
                    ? 'একটি অর্থপূর্ণ মন্তব্য লিখুন...'
                    : 'Write a comment...'
                }
                className="h-8 w-full rounded-full border border-[#e4e6eb] bg-white px-3.5 pr-8 text-xs text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8]"
              />
              <button
                type="submit"
                disabled={isAddingComment || !commentText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600 disabled:opacity-30 transition-colors p-1"
                title="Send Comment"
              >
                {isAddingComment ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="py-2 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'মন্তব্য লোড হচ্ছে...' : 'Loading comments...'}
            </div>
          ) : comments.length === 0 ? (
            <div className="py-2 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? 'এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি করুন!'
                : 'No comments yet. Be the first to comment!'}
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2 text-xs"
                >
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] dark:bg-gray-700 dark:text-gray-200 overflow-hidden">
                    {comment.author.avatar ? (
                      <Image
                        src={comment.author.avatar}
                        alt={comment.author.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span>{comment.author.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 rounded-2xl bg-white p-2.5 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#050505] dark:text-[#e4e6eb]">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8]">
                        {formatDate(comment.createdAt, locale)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[#050505] dark:text-[#e4e6eb] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Post Confirmation Dialogue */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#e4e6eb] bg-white p-5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                  Delete Post?
                </h3>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-3.5 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
              Are you sure you want to permanently remove this post?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingPost}
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-[#65676b] hover:bg-[#f0f2f5] dark:border-gray-700 dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingPost}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  deletePost(post.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isDeletingPost ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
