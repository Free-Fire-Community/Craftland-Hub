import { AlertTriangle, Shield, Users, FileText, ExternalLink, Info } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'disclaimer.meta' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DisclaimerPage() {
  const t = await getTranslations('disclaimer');
  
  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-red-400 font-medium">{t('hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-headline">
                {t('hero.title')} <span className="text-red-500">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Warning Banner */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 rounded-xl p-3 flex-shrink-0">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-400 mb-3">{t('warning.title')}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('warning.content')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <Info className="h-6 w-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.affiliation.title')}</h2>
              </div>
              <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-orange-400 font-semibold mb-2">{t('sections.affiliation.badge.title')}</h3>
                    <p className="text-gray-300">
                      <strong className="text-orange-400">{t('sections.affiliation.badge.content')}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.affiliation.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.trademarks.title')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-white font-semibold mb-3">{t('sections.trademarks.garena.title')}</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {(t.raw('sections.trademarks.garena.items') as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-white font-semibold mb-3">{t('sections.trademarks.usage.title')}</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {(t.raw('sections.trademarks.usage.items') as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.trademarks.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.fanMade.title')}</h2>
              </div>
              <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30 mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.fanMade.intro')}
                </p>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.fanMade.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.responsibility.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t('sections.responsibility.intro')}
              </p>
              <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.responsibility.content')}
                </p>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <ExternalLink className="h-6 w-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.support.title')}</h2>
              </div>
              <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-500/30 mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.support.intro')}
                </p>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-blue-400 font-semibold mb-1">{t('sections.support.official.title')}</h3>
                    <p className="text-gray-300">
                      {t('sections.support.official.content')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-500/10 rounded-lg p-3">
                  <AlertTriangle className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.availability.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.availability.intro')}
              </p>
              <div className="bg-indigo-900/20 rounded-lg p-6 border border-indigo-500/30 mt-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.availability.content')}
                </p>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-500/10 rounded-lg p-3">
                  <Users className="h-6 w-6 text-pink-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.guidelines.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.guidelines.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-500/10 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.compliance.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t('sections.compliance.intro')}
              </p>
              <div className="bg-cyan-900/20 rounded-lg p-6 border border-cyan-500/30">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.compliance.content')}
                </p>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500/10 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.contact.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t('sections.contact.intro')}
              </p>
              <div className="bg-emerald-900/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-emerald-400 font-semibold mb-1">{t('sections.contact.official.title')}</h3>
                    <p className="text-gray-300">
                      {t('sections.contact.official.content')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-8 border border-red-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500/10 rounded-lg p-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.acknowledgment.title')}</h2>
              </div>
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30 mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.acknowledgment.content')}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-sm text-gray-400 italic text-center">
                  {t('sections.acknowledgment.lastUpdated')} {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
  );
}
