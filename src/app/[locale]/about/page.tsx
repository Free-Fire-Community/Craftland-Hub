import { Flame, Users, MapPin, Award, Star, Heart, Zap, Trophy } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-blue-500/10"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-orange-400 font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-headline">
              {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Heart className="h-5 w-5 text-blue-500" />
                <span className="text-blue-400 font-medium">{t('mission.badge')}</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 font-headline">
                {t('mission.title')}
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {t('mission.paragraph1')}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t('mission.paragraph2')}
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center group">
                    <div className="bg-orange-500/10 rounded-xl p-4 mb-4 group-hover:bg-orange-500/20 transition-colors">
                      <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{t('mission.stats.maps')}</h3>
                    <p className="text-gray-400 font-medium">{t('mission.stats.mapsLabel')}</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-blue-500/10 rounded-xl p-4 mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{t('mission.stats.members')}</h3>
                    <p className="text-gray-400 font-medium">{t('mission.stats.membersLabel')}</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-green-500/10 rounded-xl p-4 mb-4 group-hover:bg-green-500/20 transition-colors">
                      <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{t('mission.stats.categories')}</h3>
                    <p className="text-gray-400 font-medium">{t('mission.stats.categoriesLabel')}</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-purple-500/10 rounded-xl p-4 mb-4 group-hover:bg-purple-500/20 transition-colors">
                      <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{t('mission.stats.support')}</h3>
                    <p className="text-gray-400 font-medium">{t('mission.stats.supportLabel')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-5 w-5 text-green-500" />
              <span className="text-green-400 font-medium">{t('features.badge')}</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 font-headline">{t('features.title')}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="bg-orange-500/10 rounded-xl p-4 w-fit mb-6 group-hover:bg-orange-500/20 transition-colors">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.discovery.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.discovery.description')}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="bg-blue-500/10 rounded-xl p-4 w-fit mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.community.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.community.description')}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="bg-green-500/10 rounded-xl p-4 w-fit mb-6 group-hover:bg-green-500/20 transition-colors">
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.quality.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('features.quality.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="py-20 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 font-headline">{t('stats.title')}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 mb-4 shadow-lg">
                <Star className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{t('stats.rating')}</h3>
              <p className="text-gray-400">{t('stats.ratingLabel')}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{t('stats.satisfaction')}</h3>
              <p className="text-gray-400">{t('stats.satisfactionLabel')}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 mb-4 shadow-lg">
                <Zap className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{t('stats.response')}</h3>
              <p className="text-gray-400">{t('stats.responseLabel')}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 mb-4 shadow-lg">
                <Trophy className="h-8 w-8 text-white mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{t('stats.creators')}</h3>
              <p className="text-gray-400">{t('stats.creatorsLabel')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl p-12 border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500/30 rounded-full px-6 py-3 mb-8">
                <Heart className="h-6 w-6 text-orange-500" />
                <span className="text-orange-400 font-semibold">{t('cta.badge')}</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 font-headline">
                {t('cta.title')}
              </h2>
              <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                >
                  {t('cta.submitButton')}
                </Link>
                <Link
                  href="/"
                  className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-gray-800"
                >
                  {t('cta.browseButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}