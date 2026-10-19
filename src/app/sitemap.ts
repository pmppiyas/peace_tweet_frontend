import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');
  const currentDate = new Date();

  // Static core routes with priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/groups`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blood`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/friends`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Attempt to fetch dynamic categories if API is reachable
  const dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${siteConfig.apiUrl}/category?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const categories = data?.data || data?.categories || [];
      if (Array.isArray(categories)) {
        for (const cat of categories) {
          if (cat.slug) {
            dynamicRoutes.push({
              url: `${baseUrl}/categories/${cat.slug}`,
              lastModified: cat.updatedAt ? new Date(cat.updatedAt) : currentDate,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch {
    // Graceful fallback if backend is offline during build
  }

  return [...staticRoutes, ...dynamicRoutes];
}
