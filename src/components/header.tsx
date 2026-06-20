'use client';

import { Search, Home, Compass, PlusSquare, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/user-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { categories } from '@/lib/mock-data';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Separator } from '@/components/ui/separator';

const LogoIcon = () => (
  <img
    src="data:image/svg+xml,%3csvg%20width='52'%20height='52'%20viewBox='0%200%2052%2052'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18.961%2025.3727L25.4265%2018.9033C26.9904%2017.3395%2029.5215%2017.3395%2031.0892%2018.9033L42.8924%2030.7066C44.4562%2032.2704%2044.4562%2034.8016%2042.8924%2036.3692L36.4268%2042.8348C34.863%2044.3986%2032.3318%2044.3986%2030.7642%2042.8348L18.961%2031.0316C17.3971%2029.4677%2017.3971%2026.9366%2018.961%2025.3727Z'%20fill='%23FABF00'/%3e%3cpath%20d='M22.9679%2048.4518L28.1603%2048.7768L12.6635%2033.2762C9.53588%2030.1485%209.53588%2025.0824%2012.6635%2021.9624L21.9624%2012.6635C25.09%209.53588%2030.1562%209.53588%2033.2762%2012.6635L48.7691%2028.1565L48.4441%2022.9641L52%2019.8021L48.7691%2011.9868L44.3529%2012.2621L39.7379%207.64706L40.0171%203.23088L32.1979%200L29.0359%203.55588H22.7003L19.8059%200L12.2621%203.23088L12.4035%207.78088L7.77706%2012.4074L3.22706%2012.2659L0%2019.8059L3.55588%2022.7041V29.0435L0%2032.1979L3.23088%2040.0132L7.64706%2039.7379L12.2621%2044.3529L11.9829%2048.7691L19.8021%2052L22.9679%2048.4518Z'%20fill='white'/%3e%3c/svg%3e"
    alt="Craftland Hub Logo"
    className="h-8 w-8"
  />
);

export function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-2 md:gap-3 border-b bg-background/95 backdrop-blur-md px-3 md:px-6 shadow-sm">
      {/* Left Section: Menu + Logo */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <LogoIcon />
                {tCommon('appName')}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">{t('home')}</span>
              </Link>

              <Link
                href="/submit"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PlusSquare className="h-5 w-5" />
                <span className="font-medium">{t('submit')}</span>
              </Link>
              
              <Separator className="my-2" />
              
              <div className="px-3">
                <p className="text-sm font-semibold text-muted-foreground mb-3">{t('categories')}</p>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors py-2 rounded-md hover:bg-primary/10 px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
          <LogoIcon />
          <h1 className="text-base md:text-lg font-bold text-foreground hidden sm:block">{tCommon('appName')}</h1>
        </Link>
      </div>

      {/* Center Section: Navigation Menu - Hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-3 xl:gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 px-2 xl:px-3 py-2 rounded-md hover:bg-primary/10"
        >
          <Home className="h-4 w-4" />
          <span className="hidden xl:inline">{t('home')}</span>
        </Link>

        <Link
          href="/submit"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 px-2 xl:px-3 py-2 rounded-md hover:bg-primary/10"
        >
          <PlusSquare className="h-4 w-4" />
          <span className="hidden xl:inline">{t('submit')}</span>
        </Link>

        {/* Categories Dropdown */}
        <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 px-2 xl:px-3 py-2 rounded-md hover:bg-primary/10"
            >
              <span className="hidden xl:inline">{t('categories')}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background border-border shadow-lg">
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Search Bar - Centered on desktop */}
      <div className="flex-1 max-w-md mx-2 md:mx-4 hidden md:block">
        <form action="/search" method="get">
          <div className="relative group">
            <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              type="search"
              name="q"
              placeholder={tCommon('searchPlaceholder')}
              className="w-full appearance-none bg-muted/50 border-0 text-foreground placeholder:text-muted-foreground/70 ps-8 rounded-full focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
            />
          </div>
        </form>
      </div>

      {/* Right Section: Search + Language + User */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Mobile Search Button */}
        <Link href="/search" className="md:hidden">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </Link>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
