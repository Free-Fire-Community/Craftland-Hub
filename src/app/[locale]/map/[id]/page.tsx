export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { FirestoreService } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { MapDetailClient } from '@/components/map-detail-client';
import { extractMapIdFromSlug } from '@/lib/map-utils';
import { generateMapSchema, generateBreadcrumbSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://craftlandhub.freefirecommunity.com';

interface MapDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: MapDetailPageProps): Promise<Metadata> {
  const { id: slug, locale } = await params;
  const mapId = extractMapIdFromSlug(slug);
  
  let map;
  try {
    map = await FirestoreService.getMap(mapId);
    if (!map) {
      const mapCodeWithPrefix = mapId.startsWith('FREEFIRE') ? mapId : `FREEFIRE${mapId}`;
      map = await FirestoreService.getMapByCode(mapCodeWithPrefix);
    }
  } catch (error) {
    console.error('Error fetching map for metadata:', error);
  }

  if (!map) {
    return {
      title: 'Map Not Found - Craftland Hub',
      description: 'The requested map could not be found.',
    };
  }

  const authorName = map.author || map.submitterName || 'Unknown Creator';
  const title = `${map.name} by ${authorName} - Craftland Hub`;
  const description = map.description 
    ? map.description.slice(0, 160) 
    : `Play ${map.name}, a ${map.category || 'custom'} map for Free Fire Craftland. Created by ${authorName}. Map Code: ${map.mapCode}`;
  
  const mapUrl = `${baseUrl}/${locale}/map/${map.id}`;
  const imageUrl = map.coverImageUrl || `${baseUrl}/craftlandhub.png`;

  return {
    title,
    description,
    keywords: [
      map.name,
      authorName,
      map.category,
      'Free Fire',
      'Craftland',
      'Custom Map',
      map.mapCode,
      ...(map.tags || []),
    ].filter(Boolean).join(', '),
    authors: [{ name: authorName }],
    creator: authorName,
    openGraph: {
      title,
      description,
      url: mapUrl,
      siteName: 'Craftland Hub',
      locale: locale,
      type: 'article',
      publishedTime: map.createdAt,
      modifiedTime: map.updatedAt || map.createdAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${map.name} - Free Fire Craftland Map`,
        },
      ],
      tags: map.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: authorName,
    },
    alternates: {
      canonical: mapUrl,
      languages: {
        'en': `${baseUrl}/en/map/${map.id}`,
        'hi': `${baseUrl}/hi/map/${map.id}`,
        'pt': `${baseUrl}/pt/map/${map.id}`,
        'es': `${baseUrl}/es/map/${map.id}`,
        'id': `${baseUrl}/id/map/${map.id}`,
        'ur': `${baseUrl}/ur/map/${map.id}`,
        'x-default': `${baseUrl}/en/map/${map.id}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function MapDetailPage({ params }: MapDetailPageProps) {
  const { id: slug, locale } = await params;
  const t = await getTranslations('mapDetail');

  // Extract the actual ID from the slug (handles both simple IDs and name-id slugs)
  const mapId = extractMapIdFromSlug(slug);
  
  console.log('[MapDetailPage] Looking for map with ID:', mapId);
  
  let map;
  
  try {
    // Try to get map by Firestore ID first
    map = await FirestoreService.getMap(mapId);
    
    console.log('[MapDetailPage] Map found by ID:', !!map);
  } catch (error) {
    console.error('[MapDetailPage] Error getting map by ID:', error);
    // Continue to try by code
  }
  
  // If not found, try to get by map code (for legacy URLs or direct code access)
  if (!map) {
    try {
      console.log('[MapDetailPage] Trying to find by map code...');
      // Try with FREEFIRE prefix (common in database)
      const mapCodeWithPrefix = mapId.startsWith('FREEFIRE') ? mapId : `FREEFIRE${mapId}`;
      map = await FirestoreService.getMapByCode(mapCodeWithPrefix);
      
      if (!map) {
        // Try with # prefix
        const mapCodeWithHash = mapId.startsWith('#') ? mapId : `#${mapId}`;
        map = await FirestoreService.getMapByCode(mapCodeWithHash);
      }
      
      console.log('[MapDetailPage] Map found by code:', !!map);
    } catch (error) {
      console.error('[MapDetailPage] Error getting map by code:', error);
    }
  }
  
  if (!map) {
    console.error('[MapDetailPage] Map not found for ID:', mapId);
    notFound();
  }

  // Increment view count
  try {
    await FirestoreService.incrementViews(map.id);
  } catch (viewError) {
    console.error('[MapDetailPage] Error incrementing views:', viewError);
    // Don't fail the page if view increment fails
  }

  // Generate structured data
  const mapSchema = generateMapSchema(map, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: map.category || 'Maps', url: `/category/${(map.category || 'maps').toLowerCase().replace(/\s+/g, '-')}` },
    { name: map.name, url: `/map/${map.id}` },
  ], locale);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="p-4 sm:p-6 lg:p-8 bg-background">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              ← {t('backToHome')}
            </Button>
          </Link>

          {/* Client Component with all interactive features */}
          <MapDetailClient map={map} />
        </div>
      </main>
    </>
  );
}
