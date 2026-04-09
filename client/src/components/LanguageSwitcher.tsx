import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/lib/i18n';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export default function LanguageSwitcher({ scrolled = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find((l) => l.code === language);
  
  // Explicit hover state management
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Handle mouseenter: Open dropdown immediately when user hovers over container
  const handleMouseEnter = () => {
    // Cancel any pending close operation
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  // Handle mouseleave: Close dropdown with small delay to prevent flickering
  // Delay allows hover over dropdown menu items
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 150);
  };

  // Handle focus: Open dropdown when user tabs to button (accessibility)
  const handleFocus = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  // Handle blur: Close dropdown when focus leaves (unless hovering)
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only close if focus is not moving to another element within container
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  // Handle keyboard: ESC closes dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      // Keep focus on button for accessibility
      const button = containerRef.current?.querySelector('button');
      button?.focus();
    }
  };

  // Handle language selection: Change language and close dropdown
  const handleLanguageSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Handle outside click: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      data-testid="language-switcher-container"
    >
      {/* Button: Opens on hover and focus, does NOT toggle on click */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 hover-elevate active-elevate-2"
        data-testid="button-language-toggle"
        onFocus={handleFocus}
        aria-label={`Language selector, currently: ${currentLang?.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-2xl leading-none">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLang?.name}</span>
        {/* Chevron animates to indicate open/closed state */}
        <ChevronDown 
          className="h-3.5 w-3.5 opacity-50 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </Button>

      {/* Dropdown menu: Only renders when isOpen is true */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95"
          data-testid="language-dropdown"
          role="menu"
          aria-label="Language selection menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 ${
                language === lang.code ? 'bg-accent/50 text-accent-foreground' : 'text-popover-foreground'
              }`}
              data-testid={`button-language-${lang.code}`}
              role="menuitem"
              aria-label={`Select ${lang.name}`}
            >
              <span className="text-2xl" aria-hidden="true">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
