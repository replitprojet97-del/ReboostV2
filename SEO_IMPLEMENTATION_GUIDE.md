# Guide d'Implémentation SEO - Altus Group

## ✅ Optimisations SEO Implémentées

### 1. Meta Tags Essentiels
- ✅ Titles optimisés pour chaque page (avec mots-clés ciblés)
- ✅ Meta descriptions uniques et descriptives (150-160 caractères)
- ✅ Meta keywords ciblés par page
- ✅ Meta robots pour contrôle d'indexation
- ✅ Meta viewport responsive
- ✅ Canonical URLs pour éviter le contenu dupliqué

### 2. Open Graph & Social Media
- ✅ Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- ✅ Twitter Card tags pour un meilleur partage sur Twitter
- ✅ Images optimisées pour le partage social (1200x630px recommandé)
- ✅ Meta tags pour Apple Mobile Web App
- ✅ Theme color pour les navigateurs mobiles

### 3. Schema.org / Données Structurées (JSON-LD)
- ✅ Organization Schema (informations de l'entreprise)
- ✅ WebSite Schema avec SearchAction
- ✅ BreadcrumbList Schema pour la navigation
- ✅ FinancialService Schema
- ✅ ContactPage Schema
- ✅ FAQPage Schema (prêt à l'emploi)
- ✅ LoanOrCredit Schema (pour les produits)

### 4. Fichiers de Configuration SEO
- ✅ robots.txt configuré et optimisé
  - Autorise les pages publiques
  - Bloque les pages privées/admin
  - Référence le sitemap
- ✅ sitemap.xml structuré
  - Toutes les pages publiques listées
  - Priorités définies
  - Fréquences de changement configurées

### 5. Performance & Sécurité
- ✅ Content Security Policy (CSP) configuré et optimisé
- ✅ Google Fonts autorisé via CSP
- ✅ Preconnect pour les ressources externes
- ✅ HSTS activé pour la sécurité
- ✅ Headers de sécurité (X-Frame-Options, X-Content-Type-Options)

### 6. Composant SEO Réutilisable
- ✅ Composant React SEO dynamique avec react-helmet-async
- ✅ Support des meta tags personnalisés par page
- ✅ Gestion des données structurées (JSON-LD)
- ✅ Support multilingue (fr_FR)
- ✅ Canonical URLs automatiques

## 📋 Comment Utiliser le Composant SEO

### Exemple Simple (Page Basique)
```tsx
import SEO from '@/components/SEO';

export default function MyPage() {
  return (
    <div>
      <SEO
        title="Titre de Ma Page - Altus Group"
        description="Description optimisée pour les moteurs de recherche"
        keywords="mot-clé1, mot-clé2, mot-clé3"
        path="/my-page"
      />
      {/* Contenu de votre page */}
    </div>
  );
}
```

### Exemple Avancé (Avec Données Structurées)
```tsx
import SEO from '@/components/SEO';
import { breadcrumbSchema, organizationSchema } from '@/lib/seo-data';

export default function ProductPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Prêt Business', path: '/products/business-loan' }
  ]);

  return (
    <div>
      <SEO
        title="Prêt Business - Altus Group | Financement pour Entreprises"
        description="Obtenez un prêt business flexible avec des taux compétitifs. Processus rapide et transparent."
        keywords="prêt business, crédit entreprise, financement PME"
        path="/products/business-loan"
        image="/products/business-loan-og.jpg"
        structuredData={[organizationSchema, breadcrumb]}
      />
      {/* Contenu de votre page */}
    </div>
  );
}
```

### Exemple avec FAQ Schema
```tsx
import SEO from '@/components/SEO';
import { faqSchema } from '@/lib/seo-data';

export default function FAQPage() {
  const faqs = faqSchema([
    {
      question: "Comment obtenir un prêt professionnel ?",
      answer: "Pour obtenir un prêt professionnel chez Altus Group, créez un compte, remplissez notre formulaire en ligne, et recevez une réponse en 24h."
    },
    {
      question: "Quels sont les taux d'intérêt ?",
      answer: "Nos taux d'intérêt sont compétitifs et personnalisés selon votre profil. Contactez-nous pour une simulation gratuite."
    }
  ]);

  return (
    <div>
      <SEO
        title="FAQ - Questions Fréquentes | Altus Group"
        description="Trouvez les réponses à vos questions sur nos prêts professionnels."
        path="/faq"
        structuredData={faqs}
      />
      {/* Contenu FAQ */}
    </div>
  );
}
```

## 🎯 Bonnes Pratiques SEO

### Titles (Titres de Page)
- **Longueur:** 50-60 caractères
- **Format:** `Page Title - Category | Brand Name`
- **Mots-clés:** Placez les mots-clés importants au début
- **Unique:** Chaque page doit avoir un title unique

### Meta Descriptions
- **Longueur:** 150-160 caractères
- **Contenu:** Résumé attrayant avec call-to-action
- **Mots-clés:** Incluez naturellement les mots-clés principaux
- **Unique:** Chaque page doit avoir une description unique

### Keywords
- **Quantité:** 5-10 mots-clés par page
- **Pertinence:** Utilisez des mots-clés liés au contenu de la page
- **Format:** Séparés par des virgules
- **Variété:** Incluez des variations et longue traîne

### Images
- **Alt text:** Toujours fournir un texte alternatif descriptif
- **Format:** WebP ou JPEG optimisé
- **Taille:** Compresser les images (< 200KB idéalement)
- **Lazy loading:** Activer pour améliorer les performances

### URLs
- **Structure:** Courtes, descriptives et avec des mots-clés
- **Format:** `/category/subcategory/page-name`
- **Caractères:** Minuscules avec tirets (-)
- **Canonical:** Toujours définir l'URL canonical

## 📊 Schema.org - Types Disponibles

### FinancialService (Organisation)
```typescript
import { organizationSchema } from '@/lib/seo-data';
// Utilisé dans structuredData
```

### WebSite
```typescript
import { websiteSchema } from '@/lib/seo-data';
// Pour la page d'accueil principalement
```

### BreadcrumbList
```typescript
import { breadcrumbSchema } from '@/lib/seo-data';

const breadcrumb = breadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' }
]);
```

### LoanOrCredit
```typescript
import { loanProductSchema } from '@/lib/seo-data';
// Pour les pages produits de prêt
```

### FAQPage
```typescript
import { faqSchema } from '@/lib/seo-data';

const faqs = faqSchema([
  { question: "...", answer: "..." }
]);
```

### ContactPage
```typescript
import { contactPageSchema } from '@/lib/seo-data';
// Pour la page contact
```

## 🔍 Vérification et Tests SEO

### Outils de Test Recommandés
1. **Google Search Console** - Indexation et performances
2. **Google Rich Results Test** - Validation des données structurées
3. **Schema.org Validator** - Validation JSON-LD
4. **PageSpeed Insights** - Performance et Core Web Vitals
5. **Mobile-Friendly Test** - Compatibilité mobile
6. **Screaming Frog** - Audit technique complet

### Checklist de Vérification
- [ ] Chaque page a un title unique
- [ ] Chaque page a une meta description unique
- [ ] Les images ont des alt text descriptifs
- [ ] Les URLs sont propres et descriptives
- [ ] Le sitemap.xml est accessible
- [ ] Le robots.txt est configuré correctement
- [ ] Les données structurées sont valides
- [ ] Les Open Graph tags sont présents
- [ ] Les canonical URLs sont correctes
- [ ] Le site est mobile-friendly
- [ ] Les temps de chargement sont < 3s
- [ ] Aucune erreur 404 sur les liens internes

## 📝 Prochaines Étapes Recommandées

### À Court Terme
1. Créer des images OG optimisées (1200x630px) pour chaque page importante
2. Ajouter le composant SEO à toutes les pages restantes
3. Générer un sitemap dynamique basé sur les routes
4. Implémenter lazy loading pour toutes les images
5. Ajouter des alt text descriptifs à toutes les images

### À Moyen Terme
1. Créer un blog avec des articles optimisés SEO
2. Implémenter un système de FAQ avec schema FAQ
3. Ajouter des avis clients avec schema Review
4. Optimiser les Core Web Vitals (LCP, FID, CLS)
5. Configurer Google Analytics 4 et Search Console

### À Long Terme
1. Créer des landing pages ciblées par mot-clé
2. Implémenter une stratégie de link building
3. Optimiser pour la recherche vocale
4. Créer du contenu vidéo avec schema VideoObject
5. Développer une stratégie de contenu multilingue

## 🌐 Configuration de Production

### Variables d'Environnement Requises
```env
# CRITIQUE pour le SEO - Utilisé pour les canonical URLs, Open Graph, et structured data
VITE_SITE_URL=https://www.votredomaine.com
```

**IMPORTANT:** Cette variable doit être définie dans votre environnement de production. Sans elle, l'application utilisera `http://localhost:5000` par défaut.

### Configuration du Déploiement
1. **Définir VITE_SITE_URL** dans les variables d'environnement de production
2. **Mise à jour du sitemap.xml** - Utiliser le template pour générer la version production:
   ```bash
   # Lors du déploiement, remplacer {{SITE_URL}} dans sitemap.xml.template
   sed "s|{{SITE_URL}}|https://www.votredomaine.com|g" client/public/sitemap.xml.template > client/public/sitemap.xml
   ```
3. **Vérification des URLs** - Tous les schemas et meta tags utilisent automatiquement `seoConfig.siteUrl`

## 📞 Support et Ressources

### Documentation Officielle
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

### Outils Utiles
- [react-helmet-async](https://github.com/staylor/react-helmet-async) - Documentation
- [Google Structured Data Testing Tool](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Dernière mise à jour:** 5 Novembre 2025
**Version:** 1.0.0
**Statut:** ✅ Production Ready
