import { useLocation } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function FooterPremium() {
  const [, setLocation] = useLocation();
  const t = useTranslations();
  
  const footerLinks = {
    solutions: [
      { label: t.footer.products.business, href: "/products" },
      { label: t.footer.products.personal, href: "/products" },
      { label: t.footer.products.mortgage, href: "/products" },
      { label: t.footer.products.auto, href: "/products" }
    ],
    company: [
      { label: t.nav.about, href: "/about" },
      { label: t.nav.howItWorks, href: "/how-it-works" },
      { label: t.nav.contact, href: "/contact" },
      { label: t.nav.resources, href: "/resources" }
    ],
    legal: [
      { label: t.footer.legalLinks.terms, href: "/terms" },
      { label: t.footer.legalLinks.privacy, href: "/privacy" }
    ]
  };
  
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold text-foreground mb-4">
              KreditPass
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md text-sm">
              {t.footer.description}
            </p>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <a href="mailto:infos@kreditpass.org" className="hover:text-foreground transition-colors" data-testid="link-footer-email">
                  infos@kreditpass.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <a href="tel:+35220302400" className="hover:text-foreground transition-colors" data-testid="link-footer-phone">
                  +352-20-302-400
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>14 Rue du Marché-aux-Herbes, L-1728 Luxembourg</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">{t.footer.productsTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); setLocation(link.href); }} 
                    className="text-foreground/70 hover:text-foreground transition-colors text-sm" 
                    data-testid={`link-footer-solution-${index}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">{t.footer.companyTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); setLocation(link.href); }} 
                    className="text-foreground/70 hover:text-foreground transition-colors text-sm" 
                    data-testid={`link-footer-company-${index}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">{t.footer.legalTitle || 'Legal'}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); setLocation(link.href); }} 
                    className="text-foreground/70 hover:text-foreground transition-colors text-sm" 
                    data-testid={`link-footer-legal-nav-${index}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
