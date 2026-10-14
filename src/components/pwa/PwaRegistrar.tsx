'use client';

import React, { useEffect } from 'react';
import { PwaInstallBanner } from './PwaInstallBanner';

export function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Check for updates periodically
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log('PeaceTweet: New version available. Refresh to update.');
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('PeaceTweet: Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return <PwaInstallBanner />;
}
