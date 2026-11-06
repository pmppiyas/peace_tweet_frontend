import { Metadata } from 'next';
import Script from 'next/script';
import { ZakatCalculatorView } from '@/features/zakat/components/ZakatCalculatorView';
import {
  ZAKAT_META,
  ZAKAT_KEYWORDS,
} from '@/features/zakat/constants/zakatMeta';

export const metadata: Metadata = {
  title: ZAKAT_META.titleBn,
  description: ZAKAT_META.descriptionBn,
  keywords: Array.from(ZAKAT_KEYWORDS),
  authors: [{ name: 'PeaceTweet' }],
  creator: 'PeaceTweet',
  publisher: 'PeaceTweet',
  applicationName: 'PeaceTweet',
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
  alternates: {
    canonical: '/zakat',
    languages: {
      'bn-BD': '/zakat',
      'en-US': '/zakat',
    },
  },
  openGraph: {
    title: ZAKAT_META.titleBn,
    description: ZAKAT_META.descriptionBn,
    url: '/zakat',
    siteName: 'PeaceTweet',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ZAKAT_META.titleBn,
    description: ZAKAT_META.descriptionBn,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PeaceTweet Zakat Calculator',
  alternateName: 'যাকাত ক্যালকুলেটর',
  url: 'https://peacetweet.com/zakat',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BDT',
  },
  description: ZAKAT_META.descriptionBn,
  keywords: ZAKAT_KEYWORDS.slice(0, 30).join(', '),
  inLanguage: ['bn', 'en'],
  featureList: [
    'Bangladesh Gold & Silver Nisab Calculation (7.5 Vori / 52.5 Vori)',
    'Real-time Cash, Bank, DPS & FDR Asset Valuation',
    'Business Stock & Commercial Investments Valuation',
    'Deductible Debts & Liabilities Offsetting',
    'Hijri (2.5%) vs Solar Calendar (2.577%) Standards',
  ],
};

export default function ZakatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ZakatCalculatorView />
    </>
  );
}
