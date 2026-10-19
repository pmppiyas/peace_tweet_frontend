import React from 'react';
import { siteConfig } from '@/config/site';

export function JsonLd() {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: ['peacetweet', 'Peace Tweet', 'ইসলামিক সোশ্যাল মিডিয়া', 'Peaceful Social Media'],
    url: baseUrl,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['bn', 'en', 'ar'],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/icon-512x512.png`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.twitter,
      siteConfig.links.github,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
