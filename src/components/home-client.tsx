'use client';

import { useState } from 'react';
import { Flame, Star, Clock, Eye, LayoutGrid, Globe, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MapGrid } from '@/components/map-grid';
import { CategoryCard } from '@/components/category-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { categories } from '@/lib/mock-data';
import { AdUnit } from '@/components/ads';
import type { Map } from '@/lib/types';

interface HomeClientProps {
  initialTrendingMaps: Map[];
  initialTopRatedMaps: Map[];
  initialRecentMaps: Map[];
  initialMostViewedMaps: Map[];
  categoryCounts: Record<string, number>;
}

const REGIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'IND', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'Europe' },
  { value: 'SEA', label: 'Southeast Asia' },
  { value: 'MENA', label: 'Middle East & North Africa' },
  { value: 'other', label: 'Other' },
];

export function HomeClient({
  initialTrendingMaps,
  initialTopRatedMaps,
  initialRecentMaps,
  initialMostViewedMaps,
  categoryCounts,
}: HomeClientProps) {
  const t = useTranslations('home');
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  // Merge category counts with category data (icons are already on client side)
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    mapCount: categoryCounts[cat.name] || 0,
  }));
  
  // Filter maps by region
  const filterByRegion = (maps: Map[]) => {
    if (selectedRegion === 'all') return maps;
    return maps.filter(map => map.region === selectedRegion);
  };

  const trendingMaps = filterByRegion(initialTrendingMaps);
  const topRatedMaps = filterByRegion(initialTopRatedMaps);
  const recentMaps = filterByRegion(initialRecentMaps);
  const mostViewedMaps = filterByRegion(initialMostViewedMaps);

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-16">
      <div className="text-center space-y-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Discover Amazing Craftland Maps
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore, rate, and share custom maps created by the Free Fire community. Find your next favorite battleground!
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Link href="/submit">
              <Upload className="me-2 h-5 w-5" />
              Submit Your Map
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="#categories">
              <LayoutGrid className="me-2 h-5 w-5" />
              Browse Categories
            </Link>
          </Button>
        </div>
        
        {/* Region Filter */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <Flame className="text-primary h-6 w-6 animate-pulse" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">{t('trending')}</h2>
          {selectedRegion !== 'all' && (
            <span className="text-sm text-muted-foreground">({trendingMaps.length} maps)</span>
          )}
        </div>
        <MapGrid maps={trendingMaps} />
      </div>

      {/* Ad: In-feed after Trending */}
      <AdUnit format="in-feed" className="my-8" />

      <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3">
          <Star className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">{t('topRated')}</h2>
          {selectedRegion !== 'all' && (
            <span className="text-sm text-muted-foreground">({topRatedMaps.length} maps)</span>
          )}
        </div>
        <MapGrid maps={topRatedMaps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-slide-in-right" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <Clock className="text-primary h-6 w-6" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">{t('recentlyAdded')}</h2>
            {selectedRegion !== 'all' && (
              <span className="text-sm text-muted-foreground">({recentMaps.length} maps)</span>
            )}
          </div>
          <MapGrid maps={recentMaps} />
        </div>
        <div id="categories" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-primary h-6 w-6" />
            <h2 className="text-3xl font-bold tracking-tight font-headline">{t('categories')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categoriesWithCounts.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          {/* Ad: Sidebar below categories */}
          <AdUnit format="sidebar" className="mt-6" />
        </div>
      </div>

      {/* Ad: Display ad before Most Viewed */}
      <AdUnit format="display" className="my-8" />

      <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3">
          <Eye className="text-primary h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">{t('mostViewed')}</h2>
          {selectedRegion !== 'all' && (
            <span className="text-sm text-muted-foreground">({mostViewedMaps.length} maps)</span>
          )}
        </div>
        <MapGrid maps={mostViewedMaps} />
      </div>
    </main>
  );
}
