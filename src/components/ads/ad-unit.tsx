'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdFormat = 'display' | 'in-feed' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
  style?: React.CSSProperties;
}

const AD_CONFIG = {
  'display': {
    slot: '7317445135',
    format: 'auto',
    fullWidthResponsive: true,
    layoutKey: undefined,
    layout: undefined,
  },
  'in-feed': {
    slot: '4452408958',
    format: 'fluid',
    fullWidthResponsive: false,
    layoutKey: '-fb+5w+4e-db+86',
    layout: undefined,
  },
  'in-article': {
    slot: '9458818851',
    format: 'fluid',
    fullWidthResponsive: false,
    layoutKey: undefined,
    layout: 'in-article',
  },
  'sidebar': {
    slot: '6237880959',
    format: 'auto',
    fullWidthResponsive: true,
    layoutKey: undefined,
    layout: undefined,
  },
} as const;

const CLIENT_ID = 'ca-pub-6409311049525505';

export function AdUnit({ format, className, style }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const config = AD_CONFIG[format];

  useEffect(() => {
    // Don't load ads in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const loadAd = () => {
      try {
        if (adRef.current && !isLoaded) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('AdSense error:', error);
        setHasError(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Don't render anything if there's an error
  if (hasError) {
    return null;
  }

  // Show placeholder in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={cn(
          'bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm',
          format === 'display' && 'min-h-[90px] md:min-h-[250px]',
          format === 'in-feed' && 'min-h-[120px]',
          format === 'in-article' && 'min-h-[250px]',
          format === 'sidebar' && 'min-h-[250px]',
          className
        )}
        style={style}
      >
        Ad Placeholder ({format})
      </div>
    );
  }

  return (
    <div 
      className={cn('ad-container overflow-hidden', className)} 
      style={style}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: config.layout === 'in-article' ? 'center' : undefined,
          ...style,
        }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-ad-layout-key={config.layoutKey}
        data-ad-layout={config.layout}
        data-full-width-responsive={config.fullWidthResponsive ? 'true' : undefined}
      />
    </div>
  );
}
