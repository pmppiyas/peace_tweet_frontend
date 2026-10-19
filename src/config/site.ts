import { envConfig } from './env';

export const siteConfig = {
  name: 'PeaceTweet',
  title: 'PeaceTweet — Peaceful Social Media & Islamic Community Platform',
  tagline: 'A peaceful social network and Facebook alternative for authentic Duas, Hadith, and inspiring Islamic reflections',
  description:
    'PeaceTweet is a peaceful social media platform and Facebook alternative to discover authentic Duas, virtues, Hadith references, Arabic recitations, and connect with a wholesome Islamic community.',
  url: envConfig.siteUrl || 'https://peacetweet.com',
  apiUrl: envConfig.apiUrl,
  logo: '/p-logo.svg',
  favicon: '/p-favicon.svg',
  ogImage: '/icon-512x512.png',
  metaAppId: envConfig.metaAppId,
  metaRedirectUri: envConfig.metaRedirectUri,
  keywords: [
    'PeaceTweet',
    'peacetweet',
    'social media',
    'islamic social media',
    'facebook alternative',
    'halal social media',
    'ফেসবুকের মতো সোশ্যাল মিডিয়া',
    'সোশ্যাল মিডিয়া',
    'dua and zikr',
    'islamic community',
    'bangladesh social network',
    'authentic hadith',
    'peaceful social network',
    'muslim social network',
  ],
  links: {
    github: 'https://github.com',
    facebook: 'https://facebook.com/peacetweet',
    twitter: 'https://twitter.com/peacetweet',
  },
};
