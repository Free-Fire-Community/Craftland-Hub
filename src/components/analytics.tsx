'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = 'G-K62W5JEY4K';

// Track page views
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event trackers
export const analytics = {
  // Map interactions
  mapView: (mapId: string, mapName: string) => {
    trackEvent('view_map', 'Maps', `${mapName} (${mapId})`);
  },
  
  mapVote: (mapId: string, voteType: 'up' | 'down') => {
    trackEvent('vote_map', 'Engagement', `${voteType}_${mapId}`);
  },
  
  mapSubmit: (mapCode: string) => {
    trackEvent('submit_map', 'Contribution', mapCode);
  },
  
  // Search
  search: (query: string, resultsCount: number) => {
    trackEvent('search', 'Search', query, resultsCount);
  },
  
  // Category browsing
  categoryView: (categoryName: string) => {
    trackEvent('view_category', 'Navigation', categoryName);
  },
  
  // User actions
  signIn: (method: string) => {
    trackEvent('sign_in', 'User', method);
  },
  
  signOut: () => {
    trackEvent('sign_out', 'User');
  },
  
  // Social sharing
  share: (platform: string, mapId: string) => {
    trackEvent('share', 'Social', `${platform}_${mapId}`);
  },
  
  // Share map
  shareMap: (mapId: string, method: string) => {
    trackEvent('share_map', 'Social', `${method}_${mapId}`);
  },
  
  // Copy map code
  copyMapCode: (mapCode: string) => {
    trackEvent('copy_code', 'Engagement', mapCode);
  },
};
