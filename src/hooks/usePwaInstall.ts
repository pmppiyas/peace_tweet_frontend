'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const STORAGE_KEYS = {
  INSTALLED: 'peacetweet_pwa_installed',
  DISMISSED_UNTIL: 'peacetweet_pwa_dismissed_until',
  DISMISS_COUNT: 'peacetweet_pwa_dismiss_count',
};

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Check if currently running inside standalone / PWA mode
  const checkIsStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const isStandaloneWindow = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneNavigator = (window.navigator as any).standalone === true;
    const isAndroidAppReferrer = document.referrer.includes('android-app://');
    const isMarkedInstalled = localStorage.getItem(STORAGE_KEYS.INSTALLED) === 'true';

    return Boolean(
      isStandaloneWindow ||
      isStandaloneNavigator ||
      isAndroidAppReferrer ||
      isMarkedInstalled
    );
  }, []);

  // Check if dismissal cooldown is still active
  const isDismissCooldownActive = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
    if (!dismissedUntil) return false;

    const expiry = parseInt(dismissedUntil, 10);
    if (isNaN(expiry)) return false;

    return Date.now() < expiry;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode
    const standalone = checkIsStandalone();
    setIsInstalled(standalone);

    // If already installed, never show prompt
    if (standalone) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // Listen to beforeinstallprompt event (Chromium, Android, Edge, Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);

      // Only show banner if cooldown is NOT active
      if (!isDismissCooldownActive()) {
        // Wait 6 seconds after page loads before gently showing the banner
        const timer = setTimeout(() => {
          if (!checkIsStandalone() && !isDismissCooldownActive()) {
            setShowBanner(true);
          }
        }, 6000);

        return () => clearTimeout(timer);
      }
    };

    // Listen to appinstalled event
    const handleAppInstalled = () => {
      localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true');
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIsStandalone, isDismissCooldownActive]);

  // Dismiss action with progressive cooldown (7 days, then 30 days)
  const dismiss = useCallback((customDays?: number) => {
    setShowBanner(false);

    if (typeof window === 'undefined') return;

    const currentCount = parseInt(
      localStorage.getItem(STORAGE_KEYS.DISMISS_COUNT) || '0',
      10
    );
    const nextCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEYS.DISMISS_COUNT, nextCount.toString());

    // 1st dismiss = 7 days cooldown, 2nd+ dismiss = 30 days cooldown
    const days = customDays || (nextCount >= 2 ? 30 : 7);
    const cooldownMs = days * 24 * 60 * 60 * 1000;
    const dismissedUntil = Date.now() + cooldownMs;

    localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, dismissedUntil.toString());
  }, []);

  // Trigger installation
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true');
        setIsInstalled(true);
        setShowBanner(false);
        setDeferredPrompt(null);
        return true;
      } else {
        // User clicked "Cancel" on browser dialog -> don't nag them again for 7 days
        dismiss(7);
        return false;
      }
    } catch (err) {
      console.error('Install prompt error:', err);
      return false;
    }
  }, [deferredPrompt, dismiss]);

  return {
    isInstallable,
    isInstalled,
    isIos,
    showBanner,
    promptInstall,
    dismiss,
  };
}
