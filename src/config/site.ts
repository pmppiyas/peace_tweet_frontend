export const siteConfig = {
  name: 'PeaceTweet',
  title: 'PeaceTweet — Peaceful Islamic Social Media & Dua Platform',
  description:
    'A peaceful social platform to discover authentic Duas, virtues, Hadith references, Arabic recitations, and inspiring Islamic reflections.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  links: {
    github: 'https://github.com',
  },
};
