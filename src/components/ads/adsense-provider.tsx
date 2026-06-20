'use client';

import Script from 'next/script';

const ADSENSE_CLIENT_ID = 'ca-pub-6409311049525505';

export function AdsenseProvider() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
