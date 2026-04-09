import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useTranslations, useLanguage, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import './circular-menu.css';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function HeaderPremium() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState({ x: '50%', y: '50%' });
  const langMenuDesktopRef = useRef<HTMLDivElement>(null);
  const langMenuMobileRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();
  const { language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inDesktopRef = langMenuDesktopRef.current && langMenuDesktopRef.current.contains(target);
      const inMobileRef = langMenuMobileRef.current && langMenuMobileRef.current.contains(target);
      if (!inDesktopRef && !inMobileRef) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleMenuOpen = () => {
    if (hamburgerRef.current) {
      const rect = hamburgerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setMenuOrigin({
        x: `${x}px`,
        y: `${y}px`,
      });
    }
    setMobileMenuOpen(true);
    setMenuClosing(false);
  };

  const handleMenuClose = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMenuClosing(false);
    }, 400);
  };

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const navLinks = [
    { href: '/products', label: t.nav.products },
    { href: '/how-it-works', label: t.nav.howItWorks },
    { href: '/resources', label: t.nav.faq },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-white dark:bg-background'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group" data-testid="link-logo">
                <span className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                  KreditPass
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); setLocation(link.href); }}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
                  data-testid={`link-${link.href.slice(1)}-desktop`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative" ref={langMenuDesktopRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
                  data-testid="button-language-selector"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLang.flag}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-card rounded-xl shadow-lg border border-border py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 ${
                          language === lang.code
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                        }`}
                        data-testid={`button-language-${lang.code}`}
                      >
                        <span className="font-medium">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button 
                  className="px-6 text-sm font-semibold rounded-full"
                  data-testid="button-auth-desktop"
                >
                  {isAuthenticated ? t.nav.dashboard : t.auth.login}
                </Button>
              </Link>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex lg:hidden items-center gap-1">
              {/* Mobile Language Selector */}
              <div className="relative" ref={langMenuMobileRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 text-foreground/70 hover:text-foreground transition-colors duration-200"
                  data-testid="button-language-selector-mobile"
                  aria-label="Language"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-card rounded-lg shadow-lg border border-border py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-[10000]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-200 ${
                          language === lang.code
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                        }`}
                        data-testid={`button-language-${lang.code}-mobile`}
                      >
                        <span className="font-medium">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Auth Button */}
              <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button 
                  className="text-sm font-semibold rounded-full"
                  data-testid="button-login-mobile-header"
                >
                  {isAuthenticated ? t.nav.dashboard : t.auth.login}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                ref={hamburgerRef}
                onClick={handleMenuOpen}
                className="p-2 text-foreground circular-menu-trigger"
                data-testid="button-mobile-menu"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Circular Reveal Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="circular-menu-container"
          style={{
            '--menu-origin-x': menuOrigin.x,
            '--menu-origin-y': menuOrigin.y,
          } as React.CSSProperties}
        >
          <div className={`circular-menu-content ${menuClosing ? 'closing' : ''}`}>
            {/* Close Button */}
            <button
              onClick={handleMenuClose}
              className="circular-menu-close"
              data-testid="button-close-menu"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Centered menu wrapper */}
            <div className="circular-menu-wrapper">
              {/* Inner scrollable wrapper */}
              <div className="circular-menu-inner-wrapper">
                {/* Navigation Links */}
                <nav className="circular-menu-nav">
                  <Link href="/" onClick={handleMenuClose}>
                    <div className="circular-menu-link" data-testid="link-home-mobile">
                      {t.nav.home}
                    </div>
                  </Link>
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={handleMenuClose}>
                      <div className="circular-menu-link" data-testid={`link-${link.href.slice(1)}-mobile`}>
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
