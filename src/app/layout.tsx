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

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PeaceTweet',
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
        <ThemeProvider>
          <AppSplashLoader />
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>
                <SocketProvider>
                  <AudioProvider>
                    <Navbar />
                    <main className="flex-1 min-h-0">{children}</main>
                    <FloatingAudioBar />
                    <MobileNav />
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
