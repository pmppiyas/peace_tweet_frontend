'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { BookOpen, Sparkles, Feather } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

export function CreatePostBox() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [fadilah, setFadilah] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [meaningBangla, setMeaningBangla] = useState('');
  const [reference, setReference] = useState('');

  const handleOpen = () => {
    if (!isAuthenticated) {
      alert(t('createPost.loginPrompt'));
      return;
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('createPost.submittedAlert'));
    setIsOpen(false);
    setTitle('');
    setFadilah('');
    setArabicText('');
    setTransliteration('');
    setMeaningBangla('');
    setReference('');
  };

  return (
    <>
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-3 sm:p-3.5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
        {/* Top Input Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
            {user?.name?.charAt(0) || '🕊️'}
          </div>

          <button
            onClick={handleOpen}
            className="flex-1 rounded-full bg-[#f0f2f5] px-4 py-2.5 text-left text-sm text-[#65676b] hover:bg-[#e4e6eb] transition-colors dark:bg-[#3a3b3c] dark:text-[#b0b3b8] dark:hover:bg-[#4e4f50]"
          >
            {user ? `${user.name}, ${t('createPost.placeholder')}` : t('createPost.placeholder')}
          </button>
        </div>

        {/* Bottom Quick Feature Actions */}
        <div className="mt-3 grid grid-cols-3 gap-1 border-t border-[#e4e6eb] pt-1.5 dark:border-[#393a3b]">
          <button
            onClick={handleOpen}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors text-xs sm:text-sm font-semibold text-[#65676b] dark:text-[#b0b3b8]"
          >
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <span className="truncate">{t('createPost.tabDua')}</span>
          </button>

          <button
            onClick={handleOpen}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors text-xs sm:text-sm font-semibold text-[#65676b] dark:text-[#b0b3b8]"
          >
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="truncate">{t('createPost.tabVirtue')}</span>
          </button>

          <Link
            href={ROUTES.CATEGORIES}
            className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors text-xs sm:text-sm font-semibold text-[#65676b] dark:text-[#b0b3b8]"
          >
            <Feather className="h-5 w-5 text-blue-500" />
            <span className="truncate">{t('createPost.tabCategories')}</span>
          </Link>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('createPost.title')}
        description={t('createPost.description')}
      >
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('createPost.virtueLabel')}
            </label>
            <textarea
              rows={3}
              placeholder={t('createPost.virtuePlaceholder')}
              value={fadilah}
              onChange={(e) => setFadilah(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <Input
            label={t('createPost.titleLabel')}
            placeholder={t('createPost.titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('createPost.arabicLabel')}
            </label>
            <textarea
              rows={2}
              dir="rtl"
              placeholder={t('createPost.arabicPlaceholder')}
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 font-arabic text-base text-right focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <Input
            label={t('createPost.transliterationLabel')}
            placeholder={t('createPost.transliterationPlaceholder')}
            value={transliteration}
            onChange={(e) => setTransliteration(e.target.value)}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('createPost.meaningLabel')}
            </label>
            <textarea
              rows={2}
              placeholder={t('createPost.meaningPlaceholder')}
              value={meaningBangla}
              onChange={(e) => setMeaningBangla(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <Input
            label={t('createPost.referenceLabel')}
            placeholder={t('createPost.referencePlaceholder')}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              {t('createPost.cancel')}
            </Button>
            <Button type="submit" className="rounded-xl px-5">
              {t('createPost.publish')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
