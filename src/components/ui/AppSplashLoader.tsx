'use client';

import React, { useEffect, useState } from 'react';
import { FullPageLoader } from './FullPageLoader';

export function AppSplashLoader() {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 650);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <FullPageLoader
      className={`transition-opacity duration-300 pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}
