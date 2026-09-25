'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArabicText } from '@/components/common/ArabicText';
import { AudioPlayer } from '@/components/common/AudioPlayer';
import { BookmarkButton } from '@/components/common/BookmarkButton';
import { CopyButton } from '@/components/common/CopyButton';
import { ShareButton } from '@/components/common/ShareButton';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Dua } from '@/types/dua.types';
import {
  BookCheck,
  Sparkles,
  Volume2,
  CheckCircle2,
  Globe,
  Clock,
  Heart,
  MessageCircle,
  Send,
  Languages,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

export function DuaDetail({ dua }: { dua: Dua }) {
  const { t, formatNumber } = useLanguage();
  const [likes, setLikes] = useState(86);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: '1',
      name: 'Dr. Mahmoud Hassan',
      text: 'JazakAllah Khair! A magnificent supplication for all Muslims.',
      time: '2 hours ago',
    },
  ]);

  const breadcrumbItems = [
    { label: t('nav.duas'), href: ROUTES.DUAS },
    ...(dua.category
      ? [{ label: dua.category.name, href: ROUTES.CATEGORY_DETAIL(dua.category.slug) }]
      : []),
    { label: dua.title },
  ];

  const fullText = [
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

  const accordionItems = [
    ...(dua.arabicText || dua.transliteration
      ? [
          {
            id: 'arabic',
            title: t('post.accordion.arabic'),
            icon: <Languages className="h-3.5 w-3.5" />,
            defaultOpen: true,
            children: (
              <div className="space-y-2.5 pt-1">
                {dua.arabicText && (
                  <div className="rounded-lg bg-emerald-50/40 p-3 dark:bg-gray-800/60 border border-emerald-100/60 dark:border-gray-800">
                    <ArabicText text={dua.arabicText} />
                  </div>
                )}
                {dua.transliteration && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{t('post.accordion.pronunciation')} </span>
                    <span className="italic">{dua.transliteration}</span>
                  </p>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      id: 'references',
      title: t('post.accordion.references'),
      icon: <BookCheck className="h-3.5 w-3.5" />,
      defaultOpen: true,
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
    ...(dua.audios && dua.audios.length > 0
      ? [
          {
            id: 'audio',
            title: t('post.accordion.audio'),
            icon: <Volume2 className="h-3.5 w-3.5" />,
            defaultOpen: true,
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

  return (
    <div className="space-y-3.5 max-w-2xl mx-auto">
      <Breadcrumbs items={breadcrumbItems} />

      <Card className="border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl overflow-hidden">
        {/* Author Header */}
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

            {dua.category && (
              <Link href={ROUTES.CATEGORY_DETAIL(dua.category.slug)}>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors">
                  #{dua.category.name}
                </span>
              </Link>
            )}
          </div>

          {/* Title & Virtue */}
          <div className="mt-3 space-y-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#050505] dark:text-[#e4e6eb]">
              🌙 {dua.title}
            </h1>

            {dua.fadilah && (
              <div className="text-[15px] text-[#050505] dark:text-[#e4e6eb] leading-relaxed font-normal">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 mr-1.5">
                  {t('post.virtueLabel')}
                </span>
                {dua.fadilah}
              </div>
            )}
          </div>
        </div>

        {/* Dua Translation */}
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

        {/* Accordion for Other Details */}
        <div className="px-3.5 sm:px-4 pb-2.5">
          <Accordion items={accordionItems} allowMultiple={true} />
        </div>

        {/* Engagement & Action Bar */}
        <div className="px-3.5 sm:px-4 py-2 flex items-center justify-between text-xs text-[#65676b] dark:text-[#b0b3b8] border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <span className="font-semibold text-rose-600">❤️ {formatNumber(likes)} {t('post.actions.likesCount', { n: '' }).replace('{n}', '').trim()}</span>
          <button onClick={() => setShowComments(!showComments)} className="hover:underline">
            {t('post.actions.commentsCount', { n: formatNumber(commentsList.length) })}
          </button>
        </div>

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

          <ShareButton title={dua.title} text={dua.meaningBangla} size="sm" variant="ghost" showLabel label={t('post.actions.share')} />
          <CopyButton text={fullText} size="sm" variant="ghost" showLabel label={t('post.actions.copy')} />
          <BookmarkButton duaId={dua.id} initialIsSaved={dua.isSaved} size="sm" variant="ghost" showLabel label={t('post.actions.save')} />
        </div>

        {showComments && (
          <div className="bg-[#f0f2f5]/60 dark:bg-[#18191a]/60 p-3.5 border-t border-[#e4e6eb] dark:border-[#393a3b] space-y-3">
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
                className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {commentsList.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white p-3 text-xs dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b]">
                  <span className="font-bold text-[#050505] dark:text-[#e4e6eb]">{c.name}</span>
                  <p className="mt-0.5 text-[#050505] dark:text-[#e4e6eb]">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
