import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  const disallowedRoutes = [
    '/admin',
    '/admin/*',
    '/auth/*',
    '/settings',
    '/settings/*',
    '/saved',
    '/api/*',
    '/feedback',
    '/blood',
    '/blood/*',
    '/categories',
    '/categories/*',
    '/groups',
    '/groups/*',
    '/friends',
    '/friends/*',
    '/zakat',
    '/search',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/register',
          '/purpose',
        ],
        disallow: disallowedRoutes,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/login',
          '/register',
          '/purpose',
        ],
        disallow: disallowedRoutes,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
