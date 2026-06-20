import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://craftlandhub.freefirecommunity.com';

export function generateSearchMetadata(locale: string, query?: string): Metadata {
  const title = query 
    ? `Search Results for "${query}" - Craftland Hub`
    : 'Search Maps - Craftland Hub';
  
  const description = query
    ? `Find Free Fire Craftland maps matching "${query}". Search by map code, creator name, or keywords.`
    : 'Search thousands of Free Fire Craftland custom maps. Find maps by code, creator, category, or keywords.';

  const searchUrl = `${baseUrl}/${locale}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`;

  return {
    title,
    description,
    keywords: 'search maps, free fire search, craftland search, map codes, find maps, map creator',
    openGraph: {
      title,
      description,
      url: searchUrl,
      siteName: 'Craftland Hub',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/craftlandhub.png`,
          width: 1200,
          height: 630,
          alt: 'Craftland Hub - Search Maps',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/craftlandhub.png`],
    },
    alternates: {
      canonical: searchUrl,
      languages: {
        'en': `${baseUrl}/en/search`,
        'hi': `${baseUrl}/hi/search`,
        'pt': `${baseUrl}/pt/search`,
        'es': `${baseUrl}/es/search`,
        'id': `${baseUrl}/id/search`,
        'ur': `${baseUrl}/ur/search`,
        'x-default': `${baseUrl}/en/search`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
