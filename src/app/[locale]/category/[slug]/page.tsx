export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FirestoreService } from '@/lib/firestore-service';
import { MapGrid } from '@/components/map-grid';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { categories } from '@/lib/mock-data';
import { CategoryPageAds } from './category-ads';
import { generateCategorySchema, generateBreadcrumbSchema, generateMapListSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://craftlandhub.freefirecommunity.com';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const category = categories.find(
    cat => cat.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!category) {
    return {
      title: 'Category Not Found - Craftland Hub',
      description: 'The requested category could not be found.',
    };
  }

  let mapCount = 0;
  try {
    const result = await FirestoreService.searchMaps({
      category: categoryName,
      limit: 1,
    });
    mapCount = result.total || 0;
  } catch (error) {
    console.error('Error fetching map count:', error);
  }

  const title = `${categoryName} Maps - Craftland Hub`;
  const description = `Discover ${mapCount > 0 ? mapCount : 'amazing'} ${categoryName.toLowerCase()} custom maps for Free Fire Craftland. Browse, rate, and play the best ${categoryName.toLowerCase()} maps created by the community.`;
  const categoryUrl = `${baseUrl}/${locale}/category/${slug}`;

  return {
    title,
    description,
    keywords: `${categoryName}, Free Fire, Craftland, Custom Maps, ${categoryName} Maps, Free Fire Maps`,
    openGraph: {
      title,
      description,
      url: categoryUrl,
      siteName: 'Craftland Hub',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/craftlandhub.png`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Maps - Craftland Hub`,
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
      canonical: categoryUrl,
      languages: {
        'en': `${baseUrl}/en/category/${slug}`,
        'hi': `${baseUrl}/hi/category/${slug}`,
        'pt': `${baseUrl}/pt/category/${slug}`,
        'es': `${baseUrl}/es/category/${slug}`,
        'id': `${baseUrl}/id/category/${slug}`,
        'ur': `${baseUrl}/ur/category/${slug}`,
        'x-default': `${baseUrl}/en/category/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations('category');

  // Convert slug back to category name
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Find category in our list
  const category = categories.find(
    cat => cat.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!category) {
    notFound();
  }

  // Fetch maps for this category
  let maps: any[] = [];
  let mapCount = 0;
  
  try {
    const result = await FirestoreService.searchMaps({
      category: categoryName,
      sortBy: 'voteScore',
      sortOrder: 'desc',
      limit: 50,
    });
    maps = result.maps;
    mapCount = maps.length;
  } catch (error) {
    console.error('Error fetching category maps:', error);
  }

  const CategoryIcon = category.icon;

  // Generate structured data
  const categorySchema = generateCategorySchema(categoryName, mapCount, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: categoryName, url: `/category/${slug}` },
  ], locale);
  const mapListSchema = maps.length > 0 ? generateMapListSchema(maps, `${categoryName} Maps`, locale) : null;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {mapListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mapListSchema) }}
        />
      )}
      
      <main className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            ← {t('backToHome')}
          </Button>
        </Link>

        {/* Category Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <CategoryIcon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('mapsFound', { count: mapCount })}
          </p>
        </div>

        {/* Ad: Display ad above results */}
        <CategoryPageAds position="top" />

        {/* Maps Grid */}
        {maps.length > 0 ? (
          <>
            <MapGrid maps={maps} />
            {/* Ad: In-feed ad below results */}
            <CategoryPageAds position="bottom" />
          </>
        ) : (
          <div className="text-center py-16">
            <CategoryIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('noMaps')}</h3>
            <p className="text-muted-foreground mb-6">{t('noMapsDescription')}</p>
            <Link href="/submit">
              <Button>{t('submitFirst')}</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
