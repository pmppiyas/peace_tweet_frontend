'use client';

import React from 'react';
import { FeedDua } from '@/features/feed/types/feed.types';
import { DuaFadilah } from './DuaFadilah';
import { DuaMeaning } from './DuaMeaning';
import { DuaArabic } from './DuaArabic';
import { DuaReference } from './DuaReference';
import { DuaAudio } from './DuaAudio';
import { cn } from '@/lib/utils/cn';

interface DuaContentProps {
  dua: FeedDua;
  showArabicCollapsible?: boolean;
  className?: string;
}

export function DuaContent({
  dua,
  showArabicCollapsible = true,
  className,
}: DuaContentProps) {
  return (
    <div className={cn('space-y-4 sm:space-y-4.5', className)}>
      {/* 1. Benefit / Virtue (without label, in pronunciation's text style) */}
      {dua.fadilah && <DuaFadilah fadilah={dua.fadilah} showLabel={false} />}

      {/* 2. Middle: Pronunciation & Bottom: Meaning */}
      <DuaMeaning
        meaning={dua.meaning || dua.meaningBangla}
        meaningBangla={dua.meaningBangla}
        duaBangla={(dua as any).duaBangla}
        transliteration={dua.transliteration}
      />

      {/* 3. Arabic Calligraphy */}
      {dua.arabicText && (
        <DuaArabic
          arabicText={dua.arabicText}
          collapsible={showArabicCollapsible}
          defaultExpanded={false}
        />
      )}

      {/* 4. Audio Recitation & References Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 sm:pt-2">
        <DuaReference references={dua.references} />

        {dua.audios && dua.audios.length > 0 && (
          <DuaAudio
            duaId={dua.id}
            duaTitle={dua.title || dua.meaning || 'Dua'}
            audio={dua.audios[0]}
            audioUrl={dua.audioUrl}
            arabicText={dua.arabicText}
          />
        )}
      </div>
    </div>
  );
}
