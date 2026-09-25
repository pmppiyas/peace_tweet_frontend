'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FeedItem as FeedItemType } from '../types/feed.types';
import { DuaPostCard } from './DuaPostCard';
import { TextPostCard } from './TextPostCard';
import { QuestionPostCard } from './QuestionPostCard';
import { AnnouncementCard } from './AnnouncementCard';
import { usePostActions } from '../hooks/usePostActions';
import { useComments } from '../hooks/useComments';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/date';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
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
  post: FeedItem;
}

export function FeedItem({ post }: FeedItemProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toggleReaction, toggleSave, deletePost, isDeletingPost } = usePostActions();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { comments, isLoading: isLoadingComments, addComment, isAddingComment } =
    useComments(post.id, showComments);

  const isAuthor = user?.id === post.author.id || user?.role === 'ADMIN';

  const handleShare = async () => {
    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/posts/${post.id}` : '';
    const shareData = {
      title: post.dua?.title || 'PeaceTweet Post',
      text: post.content || post.dua?.meaningBangla || 'PeaceTweet Islamic Post',
      url: postUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to clipboard
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(commentText.trim());
      setCommentText('');
    } catch {
      // Handled in hook
    }
  };

  return (
    <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl overflow-hidden transition-all">
      {/* 1. Author & Post Meta Header */}
      <div className="p-3.5 sm:p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs select-none">
              {post.author.name ? post.author.name.charAt(0).toUpperCase() : '🕊️'}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] text-[#050505] dark:text-[#e4e6eb]">
                  {post.author.name || 'PeaceTweet Scholar'}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                <span>@{post.author.username || 'peacetweet'}</span>
                <span>•</span>
                <span>{post.createdAt ? formatDate(post.createdAt) : 'Today'}</span>
                <span>•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {post.dua?.category && (
              <Link href={ROUTES.CATEGORY_DETAIL(post.dua.category.slug)}>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors">
                  #{post.dua.category.name}
                </span>
              </Link>
            )}

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
                        deletePost(post.id);
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
          {post.type === 'QUESTION' && <QuestionPostCard post={post} />}
          {post.type === 'ANNOUNCEMENT' && <AnnouncementCard post={post} />}
          {post.type === 'TEXT' && <TextPostCard post={post} />}
        </div>
      </div>

      {/* 3. Engagement Stats Summary */}
      {(post.stats.reactionCount > 0 || post.stats.commentCount > 0) && (
        <div className="px-3.5 sm:px-4 py-1.5 flex items-center justify-between text-xs text-[#65676b] dark:text-[#b0b3b8] border-t border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
          <div className="flex items-center gap-1.5">
            {post.stats.reactionCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px]">
                  ❤️
                </span>
                <span className="font-semibold">{post.stats.reactionCount}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {post.stats.commentCount > 0 && (
              <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className="hover:underline"
              >
                {post.stats.commentCount} মন্তব্য
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Action Buttons Bar */}
      <div className="grid grid-cols-4 border-t border-[#e4e6eb] px-2 py-1 text-xs font-semibold dark:border-[#393a3b]">
        {/* Reaction (LIKE / Ameen) */}
        <button
          type="button"
          onClick={() => toggleReaction(post.id, post.viewer.hasReacted)}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors select-none',
            post.viewer.hasReacted
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4',
              post.viewer.hasReacted && 'fill-current text-rose-600 dark:text-rose-400',
            )}
          />
          <span>{post.type === 'DUA' ? 'আমীন' : 'পছন্দ'}</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors select-none',
            showComments
              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span>মন্তব্য</span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={() => toggleSave(post.id, post.viewer.hasSaved)}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors select-none',
            post.viewer.hasSaved
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]',
          )}
        >
          <Bookmark
            className={cn(
              'h-4 w-4',
              post.viewer.hasSaved && 'fill-current text-amber-600 dark:text-amber-400',
            )}
          />
          <span>{post.viewer.hasSaved ? 'সংরক্ষিত' : 'সেভ'}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 py-2 text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#050505] rounded-lg transition-colors select-none dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] dark:hover:text-[#e4e6eb]"
        >
          <Share2 className="h-4 w-4" />
          <span>{copied ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
        </button>
      </div>

      {/* 5. Inline Comments Section */}
      {showComments && (
        <div className="border-t border-[#e4e6eb] bg-[#f0f2f5]/40 p-3.5 sm:p-4 space-y-3 dark:border-[#393a3b] dark:bg-[#3a3b3c]/20 animate-in fade-in duration-150">
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="একটি অর্থপূর্ণ মন্তব্য লিখুন..."
                className="h-8 w-full rounded-full border border-[#e4e6eb] bg-white px-3.5 pr-8 text-xs text-[#050505] placeholder:text-[#65676b] focus:border-emerald-600 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8]"
              />
              <button
                type="submit"
                disabled={isAddingComment || !commentText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 disabled:opacity-30 transition-colors p-1"
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
              মন্তব্য লোড হচ্ছে...
            </div>
          ) : comments.length === 0 ? (
            <div className="py-2 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
              এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি করুন!
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 text-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] dark:bg-gray-700 dark:text-gray-200">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-2xl bg-white p-2.5 border border-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#242526]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#050505] dark:text-[#e4e6eb]">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8]">
                        {formatDate(comment.createdAt)}
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
    </Card>
  );
}
