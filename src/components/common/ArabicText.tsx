'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { useUiStore } from '@/stores/uiStore';

export interface ArabicTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

export function ArabicText({ text, className, ...props }: ArabicTextProps) {
  const fontSize = useUiStore((state) => state.fontSize);

  const fontSizes = {
    normal: 'text-2xl sm:text-3xl leading-[2.2]',
    large: 'text-3xl sm:text-4xl leading-[2.4]',
    'extra-large': 'text-4xl sm:text-5xl leading-[2.6]',
  };

  return (
    <p
      dir="rtl"
      lang="ar"
      className={cn(
        'font-arabic font-normal tracking-wide text-gray-900 text-right select-text text-balance dark:text-emerald-50',
        fontSizes[fontSize],
        className,
      )}
      {...props}
    >
      {text}
    </p>
  );
}
