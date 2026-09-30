import { envConfig } from './env';

export const siteConfig = {
  name: 'PeaceTweet',
  title: 'PeaceTweet — Peaceful Islamic Social Media & Dua Platform',
  description:
    'A peaceful social platform to discover authentic Duas, virtues, Hadith references, Arabic recitations, and inspiring Islamic reflections.',
  url: envConfig.siteUrl,
  apiUrl: envConfig.apiUrl,
  logo: '/p-logo.svg',
  favicon: '/p-favicon.svg',
  metaAppId: envConfig.metaAppId,
  metaRedirectUri: envConfig.metaRedirectUri,
  links: {
    github: 'https://github.com',
  },
};
