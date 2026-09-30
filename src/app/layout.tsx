import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { AudioProvider } from '@/providers/AudioProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { FloatingAudioBar } from '@/features/audio/components/FloatingAudioBar';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: '/p-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/p-favicon.svg',
    apple: [
      { url: '/p-logo.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
  },
};

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={raleway.variable} suppressHydrationWarning>
      <body
        className={`${raleway.variable} font-sans min-h-screen flex flex-col antialiased bg-[#f0f2f5] text-[#050505] dark:bg-[#18191a] dark:text-[#e4e6eb]`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>
                <AudioProvider>
                  <Navbar />
                  <main className="flex-1 pb-16 md:pb-8">{children}</main>
                  <FloatingAudioBar />
                  <MobileNav />
                </AudioProvider>
              </AuthProvider>
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
