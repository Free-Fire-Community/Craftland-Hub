import { MetadataRoute } from 'next';
import { FirestoreService } from '@/lib/firestore-service';
import { categories } from '@/lib/mock-data';
import { routing } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://craftlandhub.freefirecommunity.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    '',
    '/about',
    '/submit',
    '/search',
    '/terms',
    '/privacy',
    '/disclaimer',
    '/contributors',
  ];

  // Add static pages for all locales
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    }
  }

  // Add category pages for all locales
  for (const locale of locales) {
    for (const category of categories) {
      const slug = category.name.toLowerCase().replace(/\s+/g, '-');
      sitemap.push({
        url: `${baseUrl}/${locale}/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}/category/${slug}`])
          ),
        },
      });
    }
  }

  // Fetch all maps and add to sitemap
  try {
    const result = await FirestoreService.searchMaps({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 1000, // Adjust based on your needs
    });

    for (const map of result.maps) {
      for (const locale of locales) {
        sitemap.push({
          url: `${baseUrl}/${locale}/map/${map.id}`,
          lastModified: map.updatedAt ? new Date(map.updatedAt) : new Date(map.createdAt),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              locales.map(l => [l, `${baseUrl}/${l}/map/${map.id}`])
            ),
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemap;
}
