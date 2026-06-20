import type { Map } from './types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://craftlandhub.freefirecommunity.com';

/**
 * Generate Organization structured data for the website
 */
export function generateOrganizationSchema(locale: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Craftland Hub',
    url: `${baseUrl}/${locale}`,
    logo: `${baseUrl}/craftlandhub.png`,
    description: 'Community platform for discovering and sharing Free Fire Craftland custom maps',
    sameAs: [
      // Add your social media links here when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Community Support',
      availableLanguage: ['en', 'hi', 'pt', 'es', 'id', 'ur'],
    },
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebsiteSchema(locale: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Craftland Hub',
    url: `${baseUrl}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  locale: string = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}/${locale}${item.url}`,
    })),
  };
}

/**
 * Generate VideoGame structured data for a map
 */
export function generateMapSchema(map: Map, locale: string = 'en') {
  const mapUrl = `${baseUrl}/${locale}/map/${map.id}`;
  const authorName = map.author || map.submitterName || 'Unknown Creator';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: map.name,
    description: map.description || `${map.name} - Custom Craftland map for Free Fire`,
    image: map.coverImageUrl || `${baseUrl}/craftlandhub.png`,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    gamePlatform: 'Free Fire',
    genre: map.category || 'Custom Map',
    aggregateRating: map.netVotes > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: Math.max(1, Math.min(5, 3 + (map.netVotes / 100))).toFixed(1),
      ratingCount: Math.abs(map.upvotes + map.downvotes),
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: map.views || 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: map.upvotes || 0,
      },
    ],
    datePublished: map.createdAt,
    dateModified: map.updatedAt || map.createdAt,
    url: mapUrl,
    identifier: map.mapCode,
    numberOfPlayers: map.teamSize ? {
      '@type': 'QuantitativeValue',
      value: map.teamSize,
    } : undefined,
    playMode: map.gameMode || 'MultiPlayer',
  };
}

/**
 * Generate CollectionPage structured data for category pages
 */
export function generateCategorySchema(
  categoryName: string,
  mapCount: number,
  locale: string = 'en'
) {
  const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Maps - Craftland Hub`,
    description: `Browse ${mapCount} custom ${categoryName} maps for Free Fire Craftland`,
    url: `${baseUrl}/${locale}/category/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Craftland Hub',
      url: `${baseUrl}/${locale}`,
    },
    about: {
      '@type': 'Thing',
      name: categoryName,
    },
  };
}

/**
 * Generate ItemList structured data for map listings
 */
export function generateMapListSchema(
  maps: Map[],
  listName: string,
  locale: string = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: maps.length,
    itemListElement: maps.map((map, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/${locale}/map/${map.id}`,
      name: map.name,
      image: map.coverImageUrl,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
