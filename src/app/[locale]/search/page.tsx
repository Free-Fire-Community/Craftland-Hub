'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { FirestoreService } from '@/lib/firestore-service';
import { MapGrid } from '@/components/map-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { analytics } from '@/components/analytics';
import { InlineLoader, ButtonLoader } from '@/components/loading-spinner';
import { AdUnit } from '@/components/ads';
import type { Map } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const t = useTranslations('search');
  
  const [searchText, setSearchText] = useState(query);
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (text: string) => {
    if (!text.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await FirestoreService.searchMapsByText(text);
      setMaps(results);
      
      // Track search
      analytics.search(text, results.length);
    } catch (error) {
      console.error('Search error:', error);
      setMaps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchText)}`);
      performSearch(searchText);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            ← {t('backToHome')}
          </Button>
        </Link>

        {/* Search Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('placeholder')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 md:pl-12 pr-20 md:pr-24 h-12 md:h-14 text-base md:text-lg"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 md:h-10"
              disabled={loading || !searchText.trim()}
            >
              {loading ? (
                <ButtonLoader />
              ) : (
                <>
                  <span className="hidden sm:inline">{t('searchButton')}</span>
                  <Search className="h-4 w-4 sm:hidden" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Search Hints */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground text-center mb-4">
              {t('searchHint')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['#123456', 'Parkour', 'Zombie', 'Racing'].map((hint) => (
                <Button
                  key={hint}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchText(hint);
                    performSearch(hint);
                  }}
                >
                  {hint}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <InlineLoader text={t('searching')} />}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                {t('resultsCount', { count: maps.length, query: query || searchText })}
              </p>
            </div>

            {/* Ad: Display ad above results */}
            <AdUnit format="display" className="my-6" />

            {maps.length > 0 ? (
              <MapGrid maps={maps} />
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('noResults')}</h3>
                <p className="text-muted-foreground mb-6">{t('noResultsDescription')}</p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('trySearching')}</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('searchTip1')}</li>
                    <li>{t('searchTip2')}</li>
                    <li>{t('searchTip3')}</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
