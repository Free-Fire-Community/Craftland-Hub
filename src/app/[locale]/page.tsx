export const dynamic = 'force-dynamic';

import { FirestoreService } from '@/lib/firestore-service';
import { HomeClient } from '@/components/home-client';
import { generateOrganizationSchema, generateWebsiteSchema, generateMapListSchema } from '@/lib/structured-data';
import type { Map } from '@/lib/types';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch maps from Firestore
  let trendingMaps: Map[] = [];
  let topRatedMaps: Map[] = [];
  let recentMaps: Map[] = [];
  let mostViewedMaps: Map[] = [];
  let categoryCounts: Record<string, number> = {};

  try {
    // Fetch trending maps (sorted by vote score)
    const trendingResult = await FirestoreService.searchMaps({
      sortBy: 'voteScore',
      sortOrder: 'desc',
      limit: 8,
    });
    trendingMaps = trendingResult.maps;

    // Fetch top rated maps (sorted by net votes)
    const topRatedResult = await FirestoreService.searchMaps({
      sortBy: 'netVotes',
      sortOrder: 'desc',
      limit: 8,
    });
    topRatedMaps = topRatedResult.maps;

    // Fetch recent maps (sorted by creation date)
    const recentResult = await FirestoreService.searchMaps({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 6,
    });
    recentMaps = recentResult.maps;

    // Fetch most viewed maps
    const mostViewedResult = await FirestoreService.searchMaps({
      sortBy: 'views',
      sortOrder: 'desc',
      limit: 8,
    });
    mostViewedMaps = mostViewedResult.maps;

    // Get real category counts
    categoryCounts = await FirestoreService.getCategoryCounts();
  } catch (error) {
    console.error('Error fetching maps:', error);
    // Continue with empty arrays if there's an error
  }

  // Generate structured data
  const organizationSchema = generateOrganizationSchema(locale);
  const websiteSchema = generateWebsiteSchema(locale);
  const trendingListSchema = trendingMaps.length > 0 
    ? generateMapListSchema(trendingMaps, 'Trending Maps', locale) 
    : null;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {trendingListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(trendingListSchema) }}
        />
      )}
      
      <HomeClient
        initialTrendingMaps={trendingMaps}
        initialTopRatedMaps={topRatedMaps}
        initialRecentMaps={recentMaps}
        initialMostViewedMaps={mostViewedMaps}
        categoryCounts={categoryCounts}
      />
    </>
  );
}
