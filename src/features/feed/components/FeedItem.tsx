'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { ArabicText } from '@/components/common/ArabicText';
import { AudioPlayer } from '@/components/common/AudioPlayer';
import { BookmarkButton } from '@/components/common/BookmarkButton';
import { CopyButton } from '@/components/common/CopyButton';
import { ShareButton } from '@/components/common/ShareButton';
import { Dua } from '@/types/dua.types';
import {
  Heart,
  MessageCircle,
  BookCheck,
  CheckCircle2,
  Globe,
  MoreHorizontal,
  Volume2,
  Clock,
  Sparkles,
  Send,
  Languages,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { formatDate } from '@/lib/utils/date';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/cn';

export function FeedItem({ dua }: { dua: Dua }) {
  const { t, formatNumber } = useLanguage();
  const [likes, setLikes] = useState(48);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isExpandedFadilah, setIsExpandedFadilah] = useState(false);
  const [commentsList, setCommentsList] = useState([
    {
      id: '1',
      name: 'Dr. Mahmoud Hassan',
      text: 'JazakAllah Khair! A truly blessed supplication to recite daily. May Allah grant us all the ability to practice it regularly.',
      time: '2 hours ago',
    },
    {
      id: '2',
      name: 'Abdullah Al-Mamun',
      text: 'Ameen. An essential daily Dua for protection and peace of mind.',
      time: '1 hour ago',
    },
  ]);

  const handleLike = () => {
    if (isLiked) {
      setLikes((l) => l - 1);
      setIsLiked(false);
    } else {
      setLikes((l) => l + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: Date.now().toString(),
        name: 'You',
        text: commentText.trim(),
        time: t('post.justNow'),
      },
    ]);
    setCommentText('');
  };

  const fullCopyText = [
    dua.title,
    dua.fadilah ? `\n\n${t('post.virtueLabel')}\n${dua.fadilah}` : '',
    `\n\n${t('post.duaLabel')}\n${dua.meaningBangla || dua.duaBangla}`,
    dua.arabicText ? `\n\nArabic:\n${dua.arabicText}` : '',
    dua.transliteration ? `\n\nPronunciation:\n${dua.transliteration}` : '',
    dua.references?.length
      ? `\n\nReferences:\n${dua.references.map((r) => `${r.source?.name || ''} ${r.reference}`).join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('');

  // Accordion items for additional details
  const accordionItems = [
    // 1. Arabic Text & Transliteration
    ...(dua.arabicText || dua.transliteration
      ? [
          {
            id: 'arabic',
            title: t('post.accordion.arabic'),
            icon: <Languages className="h-3.5 w-3.5" />,
            children: (
              <div className="space-y-2.5 pt-1">
                {dua.arabicText && (
                  <div className="rounded-lg bg-[#f0f2f5] p-3 dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#393a3b]">
                    <ArabicText text={dua.arabicText} />
                  </div>
                )}
                {dua.transliteration && (
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] leading-relaxed px-1">
                    <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{t('post.accordion.pronunciation')} </span>
                    <span className="italic">{dua.transliteration}</span>
                  </p>
                )}
              </div>
            ),
          },
        ]
      : []),

    // 2. Verified References
    {
      id: 'references',
      title: t('post.accordion.references'),
      icon: <BookCheck className="h-3.5 w-3.5" />,
      children: (
        <div className="space-y-1.5 pt-1">
          {dua.references && dua.references.length > 0 ? (
            dua.references.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#393a3b]"
              >
                <span className="font-medium text-[#050505] dark:text-[#e4e6eb]">
                  {ref.source?.name || 'Hadith Collection'}: {ref.reference}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {t('post.accordion.verified')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] italic">{t('post.accordion.noReferences')}</p>
          )}
        </div>
      ),
    },

    // 3. Rules & Timing
    {
      id: 'rules',
      title: t('post.accordion.rules'),
      icon: <Clock className="h-3.5 w-3.5" />,
      children: (
        <div className="space-y-1 pt-1 text-xs text-[#65676b] dark:text-[#b0b3b8]">
          <p>{t('post.accordion.timing', { cat: dua.category?.name || 'daily' })}</p>
          <p>{t('post.accordion.frequency')}</p>
        </div>
      ),
    },

    // 4. Audio Recitation
    ...(dua.audios && dua.audios.length > 0
      ? [
          {
            id: 'audio',
            title: t('post.accordion.audio'),
            icon: <Volume2 className="h-3.5 w-3.5" />,
            children: (
              <div className="space-y-1.5 pt-1">
                {dua.audios.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#393a3b]"
                  >
                    <span className="text-xs font-medium text-[#050505] dark:text-[#e4e6eb]">
                      {audio.reciterName || t('post.accordion.recitedBy')}
                    </span>
                    <AudioPlayer dua={dua} audio={audio} variant="icon" />
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),

    // 5. Lessons & Reflections
    {
      id: 'lessons',
      title: t('post.accordion.lessons'),
      icon: <Sparkles className="h-3.5 w-3.5" />,
      children: (
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] pt-1 leading-relaxed">
          {t('post.accordion.lessonsText')}
        </p>
      ),
    },
  ];

  return (
    <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl overflow-hidden transition-all">
      {/* 1. Author Header */}
      <div className="p-3.5 sm:p-4 pb-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
              🕊️
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] text-[#050505] dark:text-[#e4e6eb]">
                  {t('post.scholar')}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                <span>{dua.createdAt ? formatDate(dua.createdAt) : t('post.today')}</span>
                <span>•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dua.category && (
              <Link href={ROUTES.CATEGORY_DETAIL(dua.category.slug)}>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors">
                  #{dua.category.name}
                </span>
              </Link>
            )}
            <button
              className="text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1.5 rounded-full"
              title="Options"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* 2. MAIN POST HEAD: Virtue (Fadilah) */}
        <div className="mt-2.5 space-y-2">
          <Link href={ROUTES.DUA_DETAIL(dua.id)}>
            <h2 className="text-base sm:text-[17px] font-bold text-[#050505] hover:text-emerald-700 dark:text-[#e4e6eb] dark:hover:text-emerald-400 transition-colors">
              🌙 {dua.title}
            </h2>
          </Link>

          {/* Fadilah as the primary caption text */}
          {dua.fadilah && (
            <div className="text-[15px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed font-normal">
              <p className={cn(!isExpandedFadilah && dua.fadilah.length > 200 && 'line-clamp-3')}>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 mr-1.5">
                  {t('post.virtueLabel')}
                </span>
                {dua.fadilah}
              </p>
              {dua.fadilah.length > 200 && (
                <button
                  type="button"
                  onClick={() => setIsExpandedFadilah(!isExpandedFadilah)}
                  className="mt-1 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {isExpandedFadilah ? t('post.showLess') : t('post.showMore')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Dua Translation directly below Fadilah */}
      <div className="px-3.5 sm:px-4 pb-3">
        <div className="rounded-xl border border-[#e4e6eb] bg-[#f0f2f5]/90 p-3.5 dark:border-[#393a3b] dark:bg-[#18191a]/90 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              {t('post.duaLabel')}
            </span>
            <CopyButton
              text={dua.meaningBangla || dua.duaBangla}
              size="sm"
            />
          </div>
          <p className="text-[15px] text-[#050505] dark:text-[#e4e6eb] font-semibold leading-relaxed">
            ❝ {dua.meaningBangla || dua.duaBangla} ❞
          </p>
        </div>
      </div>

      {/* 4. Accordion for remaining details */}
      <div className="px-3.5 sm:px-4 pb-2.5">
        <Accordion items={accordionItems} allowMultiple={true} />
      </div>

      {/* 5. Engagement Metrics Bar */}
      <div className="px-3.5 sm:px-4 py-2 flex items-center justify-between text-xs text-[#65676b] dark:text-[#b0b3b8] border-t border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
            ❤️ {formatNumber(likes)}
          </span>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:underline cursor-pointer"
        >
          {t('post.actions.commentsCount', { n: formatNumber(commentsList.length) })}
        </button>
      </div>

      {/* 6. Facebook-style Action Buttons */}
      <div className="px-2 sm:px-3 py-1 border-t border-[#e4e6eb] dark:border-[#393a3b] grid grid-cols-5 gap-1 text-[#65676b] dark:text-[#b0b3b8] text-xs font-semibold">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors',
            isLiked && 'text-rose-600 font-bold',
          )}
        >
          <Heart className={cn('h-4 w-4', isLiked && 'fill-current text-rose-600')} />
          <span className="hidden sm:inline">{t('post.actions.like')}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors',
            showComments && 'text-emerald-600 font-bold',
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">{t('post.actions.comment')}</span>
        </button>

        <ShareButton
          title={dua.title}
          text={dua.meaningBangla}
          size="sm"
          variant="ghost"
          showLabel
          label={t('post.actions.share')}
        />

        <CopyButton
          text={fullCopyText}
          size="sm"
          variant="ghost"
          showLabel
          label={t('post.actions.copy')}
        />

        <BookmarkButton
          duaId={dua.id}
          initialIsSaved={dua.isSaved}
          size="sm"
          variant="ghost"
          showLabel
          label={t('post.actions.save')}
        />
      </div>

      {/* 7. Comments Thread */}
      {showComments && (
        <div className="bg-[#f0f2f5]/60 dark:bg-[#18191a]/60 p-3.5 border-t border-[#e4e6eb] dark:border-[#393a3b] space-y-3 animate-in fade-in duration-150">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('post.comments.placeholder')}
              className="h-9 w-full rounded-full border border-[#e4e6eb] bg-white px-4 text-xs placeholder:text-[#65676b] focus:border-emerald-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="rounded-full bg-emerald-600 p-2 text-white disabled:opacity-40 hover:bg-emerald-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="space-y-2 pt-1">
            {commentsList.map((c) => (
              <div key={c.id} className="rounded-2xl bg-white p-3 text-xs dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b]">
                <div className="flex items-center justify-between text-[#65676b] dark:text-[#b0b3b8] text-[11px]">
                  <span className="font-bold text-[#050505] dark:text-[#e4e6eb]">{c.name}</span>
                  <span>{c.time}</span>
                </div>
                <p className="mt-1 text-[#050505] dark:text-[#e4e6eb] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
