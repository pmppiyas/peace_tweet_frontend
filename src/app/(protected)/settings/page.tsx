'use client';

import React from 'react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { useTheme } from '@/providers/ThemeProvider';
import { useUiStore } from '@/stores/uiStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Moon, Sun, Type, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useUiStore();
  const { t } = useLanguage();

  return (
    <Container size="xl" className="py-4 sm:py-6">
      <div className="flex gap-6 justify-center">
        <Sidebar />

        <main className="w-full max-w-2xl min-w-0 space-y-4">
          <Breadcrumbs items={[{ label: t('nav.settings') }]} />

          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('nav.settings')}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Customize your display preferences, language, and Arabic font size
            </p>
          </div>

          <div className="space-y-3">
            {/* Language Preference Card */}
            <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm font-semibold">Language / ভাষা / اللغة</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Choose your preferred application language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageSwitcher variant="inline" />
              </CardContent>
            </Card>

            {/* Theme Card */}
            <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Theme Appearance</CardTitle>
                <CardDescription className="text-xs">
                  Choose between Light and Dark mode
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all',
                    theme === 'light'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold dark:bg-[#3a3b3c] shadow-2xs'
                      : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                  )}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all',
                    theme === 'dark'
                      ? 'border-emerald-600 bg-[#3a3b3c] text-emerald-400 font-bold shadow-2xs'
                      : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                  )}
                >
                  <Moon className="h-4 w-4 text-blue-400" />
                  <span>Dark Mode</span>
                </button>
              </CardContent>
            </Card>

            {/* Font Size Card */}
            <Card className="border border-[#e4e6eb] dark:border-[#393a3b] rounded-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm font-semibold">Arabic Font Size</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Adjust Arabic calligraphy text size for comfortable reading
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      'rounded-xl border p-2.5 text-xs font-medium transition-all capitalize text-center',
                      fontSize === size
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 shadow-2xs'
                        : 'border-[#e4e6eb] bg-[#f0f2f5] text-[#050505] hover:bg-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
                    )}
                  >
                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra Large'}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>

        <RightSidebar />
      </div>
    </Container>
  );
}
