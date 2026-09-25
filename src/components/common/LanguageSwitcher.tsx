'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline' | 'compact';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, availableLocales, currentLocaleInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'inline') {
    return (
      <div className={cn('grid grid-cols-3 gap-2', className)}>
        {availableLocales.map((loc) => {
          const isSelected = locale === loc.code;
          return (
            <button
              key={loc.code}
              type="button"
              onClick={() => setLocale(loc.code)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-xs font-medium transition-all',
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500 shadow-2xs'
                  : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50]'
              )}
            >
              <span className="text-xl">{loc.flag}</span>
              <span className="font-bold text-sm">{loc.nativeLabel}</span>
              <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] font-normal">
                {loc.label} ({loc.code.toUpperCase()})
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-750',
          variant === 'compact' && 'px-2 py-1',
          isOpen && 'ring-2 ring-emerald-500/20 border-emerald-500'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language (English / বাংলা / العربية)"
      >
        <span className="text-sm">{currentLocaleInfo?.flag || '🌐'}</span>
        <span className="font-semibold text-[11px] uppercase tracking-wider text-gray-800 dark:text-gray-200">
          {locale}
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180 text-emerald-600'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 origin-top-right rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur-md focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
            Language / ভাষা / اللغة
          </div>
          <div className="mt-1 space-y-0.5">
            {availableLocales.map((loc) => {
              const isSelected = locale === loc.code;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => {
                    setLocale(loc.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors',
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{loc.flag}</span>
                    <div>
                      <div className="text-xs leading-none">{loc.nativeLabel}</div>
                      <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                        {loc.label}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
