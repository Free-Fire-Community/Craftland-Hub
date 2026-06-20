'use client';

import { Heart, Globe } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaTelegram, FaXTwitter, FaReddit, FaDiscord } from 'react-icons/fa6';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const LogoIcon = () => (
  <img
    src="data:image/svg+xml,%3csvg%20width='52'%20height='52'%20viewBox='0%200%2052%2052'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18.961%2025.3727L25.4265%2018.9033C26.9904%2017.3395%2029.5215%2017.3395%2031.0892%2018.9033L42.8924%2030.7066C44.4562%2032.2704%2044.4562%2034.8016%2042.8924%2036.3692L36.4268%2042.8348C34.863%2044.3986%2032.3318%2044.3986%2030.7642%2042.8348L18.961%2031.0316C17.3971%2029.4677%2017.3971%2026.9366%2018.961%2025.3727Z'%20fill='%23FABF00'/%3e%3cpath%20d='M22.9679%2048.4518L28.1603%2048.7768L12.6635%2033.2762C9.53588%2030.1485%209.53588%2025.0824%2012.6635%2021.9624L21.9624%2012.6635C25.09%209.53588%2030.1562%209.53588%2033.2762%2012.6635L48.7691%2028.1565L48.4441%2022.9641L52%2019.8021L48.7691%2011.9868L44.3529%2012.2621L39.7379%207.64706L40.0171%203.23088L32.1979%200L29.0359%203.55588H22.7003L19.8059%200L12.2621%203.23088L12.4035%207.78088L7.77706%2012.4074L3.22706%2012.2659L0%2019.8059L3.55588%2022.7041V29.0435L0%2032.1979L3.23088%2040.0132L7.64706%2039.7379L12.2621%2044.3529L11.9829%2048.7691L19.8021%2052L22.9679%2048.4518Z'%20fill='white'/%3e%3c/svg%3e"
    alt="Craftland Hub Logo"
    className="h-6 w-6"
  />
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LogoIcon />
              <span className="text-xl font-bold text-white">{tCommon('appName')}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://whatsapp.com/channel/0029VaATgtHLdQekDmKiuI1u" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="WhatsApp Channel"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/ff.communityofficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/freefirecommunityint" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Telegram"
              >
                <FaTelegram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/FreeFireInt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.freefirecommunity.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a 
                href="https://www.reddit.com/r/Free_Fire_Community/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-600 transition-colors"
                aria-label="Reddit"
              >
                <FaReddit className="h-5 w-5" />
              </a>
              <a 
                href="https://discord.com/invite/free-fire-community-1025382753790865508" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                aria-label="Discord"
              >
                <FaDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('submit')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('browse')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('categories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('community')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contributors" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {t('topContributors')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <a href="https://ffcraftland.garena.com/en/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {t('officialCraftland')}
                </a>
              </li>
              <li>
                <a href="https://ffcraftland.garena.com/en/article/96" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {t('creatorProgram')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/Free-Fire-Community/Craftland-Hub/issues/new/choose" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {t('reportIssue')}
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('terms')}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {tNav('disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 md:mb-0">
            <span>© {currentYear} {tCommon('appName')}. {t('madeWith')}</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <a
              href="https://www.freefirecommunity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-orange-500 ms-1"
            >
              {t('forCommunity')}
            </a>
            <span className="text-gray-400">.</span>
          </div>
          <div className="text-gray-500 text-xs text-center md:text-right">
            {t('disclaimer')}
          </div>
        </div>
      </div>
    </footer>
  );
}