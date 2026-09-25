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
    <div className={cn('space-y-3.5', className)}>
      {/* 1. Virtue / Fadilah */}
      {dua.fadilah && <DuaFadilah fadilah={dua.fadilah} />}

      {/* 2. Bangla Meaning & Transliteration */}
      <DuaMeaning
        meaningBangla={dua.meaningBangla}
        duaBangla={dua.duaBangla}
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
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <DuaReference references={dua.references} />

        {dua.audios && dua.audios.length > 0 && (
          <DuaAudio
            duaId={dua.id}
            duaTitle={dua.title}
            audio={dua.audios[0]}
            audioUrl={dua.audioUrl}
            arabicText={dua.arabicText}
          />
        )}
      </div>
    </div>
  );
}
