'use client';

import { AdUnit } from '@/components/ads';

interface CategoryPageAdsProps {
  position: 'top' | 'bottom';
}

export function CategoryPageAds({ position }: CategoryPageAdsProps) {
  if (position === 'top') {
    return <AdUnit format="display" className="my-6" />;
  }
  
  return <AdUnit format="in-feed" className="mt-8" />;
}
