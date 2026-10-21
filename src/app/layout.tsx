import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { AudioProvider } from '@/providers/AudioProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { FloatingAudioBar } from '@/features/audio/components/FloatingAudioBar';
import { AppSplashLoader } from '@/components/ui/AppSplashLoader';
import { ChatDock } from '@/features/chat/components/ChatDock';
import { PwaRegistrar } from '@/components/pwa/PwaRegistrar';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'PeaceTweet Team', url: siteConfig.url }],
  creator: 'PeaceTweet',
  publisher: 'PeaceTweet',
  applicationName: 'PeaceTweet',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'PeaceTweet — Peaceful Social Media & Islamic Community Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/icon-512x512.png'],
    creator: '@peacetweet',
    site: '@peacetweet',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PeaceTweet',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: [
      { url: '/p-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/p-favicon.svg',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#1877f2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={raleway.variable} suppressHydrationWarning>
      <body
        className={`${raleway.variable} font-sans min-h-screen flex flex-col antialiased bg-[#f0f2f5] text-[#050505] dark:bg-[#18191a] dark:text-[#e4e6eb] overflow-x-hidden`}
      >
        <JsonLd />
        <ThemeProvider>
          <AppSplashLoader />
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>
                <SocketProvider>
                  <AudioProvider>
                    <Suspense fallback={<header className="sticky top-0 z-40 w-full h-14 bg-white dark:bg-[#242526] border-b border-[#e4e6eb] dark:border-[#393a3b]" />}>
                      <Navbar />
                    </Suspense>
                    <main className="flex-1 min-h-0">{children}</main>
                    <FloatingAudioBar />
                    <Suspense fallback={null}>
                      <MobileNav />
                    </Suspense>
                    <ChatDock />
                    <PwaRegistrar />
                  </AudioProvider>
                </SocketProvider>
              </AuthProvider>
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
