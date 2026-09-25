import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { AudioProvider } from '@/providers/AudioProvider';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { FloatingAudioBar } from '@/features/audio/components/FloatingAudioBar';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunitoSans.variable} suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} font-sans min-h-screen flex flex-col antialiased bg-[#f0f2f5] text-[#050505] dark:bg-[#18191a] dark:text-[#e4e6eb]`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>
                <AudioProvider>
                  <Navbar />
                  <main className="flex-1 pb-16 md:pb-8">{children}</main>
                  <FloatingAudioBar />
                  <Footer />
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
