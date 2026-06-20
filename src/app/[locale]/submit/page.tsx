export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { SubmitPageClient } from '@/components/submit-page-client';

export default async function SubmitPage() {
  const t = await getTranslations('submit');
  
  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <SubmitPageClient />
      </div>
    </main>
  );
}
