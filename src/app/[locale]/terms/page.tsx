import { FileText, Shield, Users, AlertCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms.meta' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TermsPage() {
  const t = await getTranslations('terms');
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-blue-400 font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-headline">
              {t('hero.title')} <span className="text-blue-500">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-orange-400 mb-2">{t('notice.title')}</h2>
              <p className="text-gray-300">
                {t('notice.lastUpdated')} {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.acceptance.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.acceptance.content')}
            </p>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500/10 rounded-lg p-3">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.license.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {t('sections.license.intro')}
            </p>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                {(t.raw('sections.license.items') as string[]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/10 rounded-lg p-3">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.userContent.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {t('sections.userContent.intro')}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.userContent.responsibility')}
            </p>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600 mt-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {(t.raw('sections.userContent.items') as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500/10 rounded-lg p-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.prohibited.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {t('sections.prohibited.intro')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {(t.raw('sections.prohibited.column1') as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {(t.raw('sections.prohibited.column2') as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.moderation.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.moderation.content')}
            </p>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500/10 rounded-lg p-3">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.disclaimer.title')}</h2>
            </div>
            <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-500/30">
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.disclaimer.content')}
              </p>
            </div>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.limitations.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.limitations.content')}
            </p>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-500/10 rounded-lg p-3">
                <FileText className="h-6 w-6 text-teal-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.accuracy.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.accuracy.content')}
            </p>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-500/10 rounded-lg p-3">
                <AlertCircle className="h-6 w-6 text-pink-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.modifications.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.modifications.content')}
            </p>
          </section>

          <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-cyan-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.governing.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.governing.content')}
            </p>
          </section>

          <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('sections.contact.title')}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('sections.contact.content')}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
