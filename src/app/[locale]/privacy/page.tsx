import { Shield, Eye, Lock, Database, Cookie, Globe, UserCheck, FileText } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy.meta' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  
  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-green-400 font-medium">{t('hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-headline">
                {t('hero.title')} <span className="text-green-500">{t('hero.titleHighlight')}</span>
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
              <Lock className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-green-400 mb-2">{t('notice.title')}</h2>
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
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.collection.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {t('sections.collection.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-3">{t('sections.collection.account.title')}</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {(t.raw('sections.collection.account.items') as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-3">{t('sections.collection.content.title')}</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {(t.raw('sections.collection.content.items') as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.usage.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {t('sections.usage.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/20 rounded-lg p-2 mt-1">
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{t('sections.usage.services.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('sections.usage.services.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 rounded-lg p-2 mt-1">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{t('sections.usage.personalization.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('sections.usage.personalization.description')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500/20 rounded-lg p-2 mt-1">
                      <FileText className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{t('sections.usage.communication.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('sections.usage.communication.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500/20 rounded-lg p-2 mt-1">
                      <Lock className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{t('sections.usage.security.title')}</h3>
                      <p className="text-gray-400 text-sm">{t('sections.usage.security.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <Globe className="h-6 w-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.sharing.title')}</h2>
              </div>
              <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-orange-400 font-semibold mb-2">{t('sections.sharing.noSell.title')}</h3>
                    <p className="text-gray-300">
                      {t('sections.sharing.noSell.content')}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.sharing.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 text-center">
                  <h4 className="text-white font-medium mb-2">{t('sections.sharing.providers')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.sharing.providersDesc')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 text-center">
                  <h4 className="text-white font-medium mb-2">{t('sections.sharing.legal')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.sharing.legalDesc')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 text-center">
                  <h4 className="text-white font-medium mb-2">{t('sections.sharing.business')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.sharing.businessDesc')}</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500/10 rounded-lg p-3">
                  <Lock className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.security.title')}</h2>
              </div>
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.security.content')}
                </p>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <Cookie className="h-6 w-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.cookies.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.cookies.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-500/10 rounded-lg p-3">
                  <Globe className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.thirdParty.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.thirdParty.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-500/10 rounded-lg p-3">
                  <UserCheck className="h-6 w-6 text-pink-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.children.title')}</h2>
              </div>
              <div className="bg-pink-900/20 rounded-lg p-6 border border-pink-500/30">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('sections.children.content')}
                </p>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-500/10 rounded-lg p-3">
                  <Database className="h-6 w-6 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.retention.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.retention.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-500/10 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-teal-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.rights.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {t('sections.rights.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.access.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.access.description')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.correction.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.correction.description')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.deletion.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.deletion.description')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.portability.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.portability.description')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.restriction.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.restriction.description')}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-2">{t('sections.rights.objection.title')}</h4>
                  <p className="text-gray-400 text-sm">{t('sections.rights.objection.description')}</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500/10 rounded-lg p-3">
                  <Globe className="h-6 w-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.international.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.international.content')}
              </p>
            </section>

            <section className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-violet-500/10 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-violet-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">{t('sections.changes.title')}</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('sections.changes.content')}
              </p>
            </section>

            <section className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-8 border border-green-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <UserCheck className="h-6 w-6 text-green-500" />
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
