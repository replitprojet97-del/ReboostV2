import { motion } from 'framer-motion';
import { TrendingUp, Lock, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
const businessProfessionalsImg = '/sectors/business_professionals_planning_finance.png';
const familyPlanningImg = '/sectors/family_planning_financial_future.png';
const renewableEnergyImg = '/sectors/renewable_energy_infrastructure.png';
const realEstateImg = '/sectors/real_estate_development_project.png';

interface SectorSection {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  ctaText: string;
}

const translations = {
  fr: {
    title: 'Nos secteurs d\'intervention',
    subtitle: 'Des solutions de financement adaptées à tous vos besoins professionnels et personnels',
    sectors: [
      {
        title: 'Crédits entreprise',
        subtitle: 'votre fonds de roulement à portée de clic',
        description: 'Des financements pensés pour les structures de toutes tailles : création, développement et croissance externe.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Prêts équipement', description: 'Financement adaptée pour l\'acquisition de matériel et équipements professionnels' },
          { title: 'Crédit-bail', description: 'Solutions flexibles de location avec option d\'achat à la fin de la période' },
          { title: 'Affacturage', description: 'Optimisez votre trésorerie en cédant vos créances clients' },
        ],
        ctaText: 'Demander un financement entreprise',
      },
      {
        title: 'Prêts aux particuliers',
        subtitle: 'réalisez vos projets de vie',
        description: 'Réalisez vos projets de vie grâce à des offres adaptées : acquisition immobilière, mobilité, aménagement.',
        image: familyPlanningImg,
        features: [
          { title: 'Prêts immobiliers', description: 'Concrétisez vos rêves immobiliers avec des conditions avantageuses et un accompagnement expert' },
          { title: 'Crédits auto', description: 'Financement flexible pour votre véhicule neuf ou d\'occasion' },
          { title: 'Prêts travaux', description: 'Rénovez votre habitat avec des solutions de financement sur mesure' },
        ],
        ctaText: 'Explorer les offres pour particuliers',
      },
      {
        title: 'Regroupement de crédits',
        subtitle: 'maîtrisez votre budget',
        description: 'Atténuez vos charges mensuelles en affinant vos emprunts. Sécurisez une gestion budgétaire sereine.',
        image: renewableEnergyImg,
        features: [
          { title: 'Audit de crédit', description: 'Analyse complète de votre situation financière et identification des opportunités' },
          { title: 'Restructuration', description: 'Réorganisation intelligente de vos dettes pour réduire vos mensualités' },
          { title: 'Optimisation', description: 'Amélioration de votre trésorerie et augmentation de votre pouvoir d\'achat' },
        ],
        ctaText: 'Consulter pour un regroupement',
      },
      {
        title: 'Offres alternatives',
        subtitle: 'adaptées aux évolutions du marché',
        description: 'Des produits financiers modernes qui s\'adaptent aux évolutions du marché et aux besoins émergents.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Accédez aux dernières innovations en technologies financières et digital banking' },
          { title: 'Green finance', description: 'Investissez dans des projets durables et écologiques avec impact positif' },
          { title: 'Inno finance', description: 'Découvrez des solutions financières innovantes adaptées à votre profil' },
        ],
        ctaText: 'Découvrir les offres alternatives',
      },
    ],
  },
  en: {
    title: 'Our Areas of Expertise',
    subtitle: 'Financing solutions tailored to all your professional and personal needs',
    sectors: [
      {
        title: 'Business Loans',
        subtitle: 'your working capital at your fingertips',
        description: 'Financing designed for organizations of all sizes: startup, development and external growth.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Equipment Loans', description: 'Tailored financing for the acquisition of equipment and professional materials' },
          { title: 'Leasing', description: 'Flexible rental solutions with purchase option at the end of the period' },
          { title: 'Factoring', description: 'Optimize your cash flow by selling your customer receivables' },
        ],
        ctaText: 'Request business financing',
      },
      {
        title: 'Personal Loans',
        subtitle: 'achieve your life projects',
        description: 'Achieve your life projects with tailored offers: real estate acquisition, mobility, renovation.',
        image: familyPlanningImg,
        features: [
          { title: 'Mortgages', description: 'Realize your real estate dreams with favorable terms and expert support' },
          { title: 'Auto Loans', description: 'Flexible financing for your new or used vehicle' },
          { title: 'Home Improvement Loans', description: 'Renovate your home with customized financing solutions' },
        ],
        ctaText: 'Explore personal loan offers',
      },
      {
        title: 'Debt Consolidation',
        subtitle: 'take control of your budget',
        description: 'Reduce your monthly payments by consolidating your loans. Ensure peaceful financial management.',
        image: renewableEnergyImg,
        features: [
          { title: 'Credit Audit', description: 'Complete analysis of your financial situation and identification of opportunities' },
          { title: 'Restructuring', description: 'Intelligent reorganization of your debts to reduce your monthly payments' },
          { title: 'Optimization', description: 'Improve your cash flow and increase your purchasing power' },
        ],
        ctaText: 'Consult for debt consolidation',
      },
      {
        title: 'Alternative Offers',
        subtitle: 'adapted to market changes',
        description: 'Modern financial products that adapt to market changes and emerging needs.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Access the latest innovations in financial technology and digital banking' },
          { title: 'Green Finance', description: 'Invest in sustainable and ecological projects with positive impact' },
          { title: 'Innovation Finance', description: 'Discover innovative financial solutions tailored to your profile' },
        ],
        ctaText: 'Discover alternative offers',
      },
    ],
  },
  es: {
    title: 'Nuestros Sectores de Intervención',
    subtitle: 'Soluciones de financiación adaptadas a todas sus necesidades profesionales y personales',
    sectors: [
      {
        title: 'Créditos Empresariales',
        subtitle: 'su capital de trabajo al alcance de un clic',
        description: 'Financiación diseñada para organizaciones de todos los tamaños: inicio, desarrollo y crecimiento externo.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Préstamos de Equipos', description: 'Financiación adaptada para la adquisición de equipos y materiales profesionales' },
          { title: 'Arrendamiento', description: 'Soluciones flexibles de alquiler con opción de compra al final del período' },
          { title: 'Factoraje', description: 'Optimice su flujo de caja vendiendo sus cuentas por cobrar' },
        ],
        ctaText: 'Solicitar financiación empresarial',
      },
      {
        title: 'Préstamos Personales',
        subtitle: 'realice sus proyectos de vida',
        description: 'Realice sus proyectos de vida con ofertas adaptadas: adquisición inmobiliaria, movilidad, renovación.',
        image: familyPlanningImg,
        features: [
          { title: 'Hipotecas', description: 'Realice sus sueños inmobiliarios con términos favorables y apoyo experto' },
          { title: 'Préstamos para Autos', description: 'Financiación flexible para su vehículo nuevo o usado' },
          { title: 'Préstamos para Mejoras del Hogar', description: 'Renueve su hogar con soluciones de financiación personalizadas' },
        ],
        ctaText: 'Explorar ofertas de préstamos personales',
      },
      {
        title: 'Consolidación de Deuda',
        subtitle: 'tome control de su presupuesto',
        description: 'Reduzca sus pagos mensuales consolidando sus préstamos. Asegure una gestión financiera tranquila.',
        image: renewableEnergyImg,
        features: [
          { title: 'Auditoría de Crédito', description: 'Análisis completo de su situación financiera e identificación de oportunidades' },
          { title: 'Reestructuración', description: 'Reorganización inteligente de sus deudas para reducir sus pagos mensuales' },
          { title: 'Optimización', description: 'Mejore su flujo de caja y aumente su poder de compra' },
        ],
        ctaText: 'Consultar para consolidación de deuda',
      },
      {
        title: 'Ofertas Alternativas',
        subtitle: 'adaptadas a los cambios del mercado',
        description: 'Productos financieros modernos que se adaptan a los cambios del mercado y las necesidades emergentes.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Acceda a las últimas innovaciones en tecnología financiera y banca digital' },
          { title: 'Finanzas Verdes', description: 'Invierta en proyectos sostenibles y ecológicos con impacto positivo' },
          { title: 'Finanzas Innovadoras', description: 'Descubra soluciones financieras innovadoras adaptadas a su perfil' },
        ],
        ctaText: 'Descubrir ofertas alternativas',
      },
    ],
  },
  pt: {
    title: 'Nossas Áreas de Atuação',
    subtitle: 'Soluções de financiamento adaptadas a todas as suas necessidades profissionais e pessoais',
    sectors: [
      {
        title: 'Créditos Empresariais',
        subtitle: 'seu capital de giro ao alcance de um clique',
        description: 'Financiamento projetado para organizações de todos os tamanhos: startup, desenvolvimento e crescimento externo.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Empréstimos de Equipamentos', description: 'Financiamento adaptado para aquisição de equipamentos e materiais profissionais' },
          { title: 'Leasing', description: 'Soluções flexíveis de aluguel com opção de compra ao final do período' },
          { title: 'Factoring', description: 'Otimize seu fluxo de caixa vendendo suas contas a receber' },
        ],
        ctaText: 'Solicitar financiamento empresarial',
      },
      {
        title: 'Empréstimos Pessoais',
        subtitle: 'realize seus projetos de vida',
        description: 'Realize seus projetos de vida com ofertas adaptadas: aquisição imobiliária, mobilidade, renovação.',
        image: familyPlanningImg,
        features: [
          { title: 'Hipotecas', description: 'Realize seus sonhos imobiliários com termos favoráveis e suporte especializado' },
          { title: 'Empréstimos para Veículos', description: 'Financiamento flexível para seu veículo novo ou usado' },
          { title: 'Empréstimos para Reforma', description: 'Renove sua casa com soluções de financiamento personalizadas' },
        ],
        ctaText: 'Explorar ofertas de empréstimos pessoais',
      },
      {
        title: 'Consolidação de Dívida',
        subtitle: 'assuma o controle de seu orçamento',
        description: 'Reduza seus pagamentos mensais consolidando seus empréstimos. Garanta uma gestão financeira tranquila.',
        image: renewableEnergyImg,
        features: [
          { title: 'Auditoria de Crédito', description: 'Análise completa de sua situação financeira e identificação de oportunidades' },
          { title: 'Reestruturação', description: 'Reorganização inteligente de suas dívidas para reduzir seus pagamentos mensais' },
          { title: 'Otimização', description: 'Melhore seu fluxo de caixa e aumente seu poder de compra' },
        ],
        ctaText: 'Consultar para consolidação de dívida',
      },
      {
        title: 'Ofertas Alternativas',
        subtitle: 'adaptadas às mudanças do mercado',
        description: 'Produtos financeiros modernos que se adaptam às mudanças do mercado e necessidades emergentes.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Acesse as últimas inovações em tecnologia financeira e banco digital' },
          { title: 'Finanças Verdes', description: 'Invista em projetos sustentáveis e ecológicos com impacto positivo' },
          { title: 'Finanças Inovadoras', description: 'Descubra soluções financeiras inovadoras adaptadas ao seu perfil' },
        ],
        ctaText: 'Descobrir ofertas alternativas',
      },
    ],
  },
  it: {
    title: 'I Nostri Settori di Intervento',
    subtitle: 'Soluzioni di finanziamento adattate a tutte le vostre esigenze professionali e personali',
    sectors: [
      {
        title: 'Crediti Aziendali',
        subtitle: 'il vostro capitale circolante a portata di clic',
        description: 'Finanziamenti progettati per organizzazioni di tutte le dimensioni: startup, sviluppo e crescita esterna.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Prestiti Attrezzature', description: 'Finanziamento adattato per l\'acquisizione di attrezzature e materiali professionali' },
          { title: 'Leasing', description: 'Soluzioni di noleggio flessibili con opzione di acquisto al termine del periodo' },
          { title: 'Factoring', description: 'Ottimizzate il vostro flusso di cassa vendendo i vostri crediti verso i clienti' },
        ],
        ctaText: 'Richiedi finanziamento aziendale',
      },
      {
        title: 'Prestiti Personali',
        subtitle: 'realizzate i vostri progetti di vita',
        description: 'Realizzate i vostri progetti di vita con offerte adattate: acquisizione immobiliare, mobilità, ristrutturazione.',
        image: familyPlanningImg,
        features: [
          { title: 'Mutui', description: 'Realizzate i vostri sogni immobiliari con condizioni favorevoli e supporto specializzato' },
          { title: 'Prestiti Auto', description: 'Finanziamento flessibile per il vostro veicolo nuovo o usato' },
          { title: 'Prestiti Ristrutturazione', description: 'Rinnovate la vostra casa con soluzioni di finanziamento personalizzate' },
        ],
        ctaText: 'Esplora offerte di prestiti personali',
      },
      {
        title: 'Consolidamento Debiti',
        subtitle: 'riprendete il controllo del vostro budget',
        description: 'Riducete i vostri pagamenti mensili consolidando i vostri prestiti. Garantite una gestione finanziaria tranquila.',
        image: renewableEnergyImg,
        features: [
          { title: 'Audit del Credito', description: 'Analisi completa della vostra situazione finanziaria e identificazione delle opportunità' },
          { title: 'Ristrutturazione', description: 'Riorganizzazione intelligente dei vostri debiti per ridurre i vostri pagamenti mensali' },
          { title: 'Ottimizzazione', description: 'Migliorate il vostro flusso di cassa e aumentate il vostro potere d\'acquisto' },
        ],
        ctaText: 'Consulta per consolidamento debiti',
      },
      {
        title: 'Offerte Alternative',
        subtitle: 'adattate ai cambiamenti del mercato',
        description: 'Prodotti finanziari moderni che si adattano ai cambiamenti del mercato e alle esigenze emergenti.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Accedete alle ultime innovazioni in tecnologia finanziaria e banca digitale' },
          { title: 'Finanza Verde', description: 'Investite in progetti sostenibili ed ecologici con impatto positivo' },
          { title: 'Finanza Innovativa', description: 'Scoprite soluzioni finanziarie innovative adattate al vostro profilo' },
        ],
        ctaText: 'Scopri offerte alternative',
      },
    ],
  },
  de: {
    title: 'Unsere Tätigkeitsbereiche',
    subtitle: 'Finanzierungslösungen, die auf alle Ihre beruflichen und persönlichen Anforderungen zugeschnitten sind',
    sectors: [
      {
        title: 'Geschäftskredite',
        subtitle: 'Ihr Betriebskapital in nur einem Klick',
        description: 'Finanzierung für Organisationen aller Größen: Gründung, Entwicklung und externes Wachstum.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Ausrüstungskredite', description: 'Maßgeschneiderte Finanzierung zum Erwerb von Geräten und beruflichen Materialien' },
          { title: 'Leasing', description: 'Flexible Mietlösungen mit Kaufoption am Ende der Laufzeit' },
          { title: 'Factoring', description: 'Optimieren Sie Ihren Cashflow durch den Verkauf Ihrer Kundenforderungen' },
        ],
        ctaText: 'Geschäftsfinanzierung anfordern',
      },
      {
        title: 'Persönliche Kredite',
        subtitle: 'verwirklichen Sie Ihre Lebensprojekte',
        description: 'Verwirklichen Sie Ihre Lebensprojekte mit maßgeschneiderten Angeboten: Immobilienerwerb, Mobilität, Renovierung.',
        image: familyPlanningImg,
        features: [
          { title: 'Hypotheken', description: 'Verwirklichen Sie Ihre Immobilienträume mit günstigen Bedingungen und Fachunterstützung' },
          { title: 'Autokredite', description: 'Flexible Finanzierung für Ihr neues oder gebrauchtes Fahrzeug' },
          { title: 'Renovierungskredite', description: 'Renovieren Sie Ihr Haus mit maßgeschneiderten Finanzierungslösungen' },
        ],
        ctaText: 'Persönliche Kreditangebote erkunden',
      },
      {
        title: 'Schuldenkonsolidierung',
        subtitle: 'kontrollieren Sie Ihr Budget',
        description: 'Reduzieren Sie Ihre monatlichen Zahlungen durch die Konsolidierung Ihrer Kredite. Sichern Sie eine ruhige Finanzverwaltung.',
        image: renewableEnergyImg,
        features: [
          { title: 'Kreditprüfung', description: 'Umfassende Analyse Ihrer finanziellen Situation und Identifizierung von Chancen' },
          { title: 'Umstrukturierung', description: 'Intelligente Umstrukturierung Ihrer Schulden zur Reduzierung Ihrer monatlichen Zahlungen' },
          { title: 'Optimierung', description: 'Verbessern Sie Ihren Cashflow und erhöhen Sie Ihre Kaufkraft' },
        ],
        ctaText: 'Schuldenkonsolidierung konsultieren',
      },
      {
        title: 'Alternative Angebote',
        subtitle: 'angepasst an Marktveränderungen',
        description: 'Moderne Finanzprodukte, die sich an Marktveränderungen und aufkommende Bedürfnisse anpassen.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Greifen Sie auf die neuesten Innovationen in Finanztechnologie und Digital Banking zu' },
          { title: 'Green Finance', description: 'Investieren Sie in nachhaltige und ökologische Projekte mit positiver Auswirkung' },
          { title: 'Innovation Finance', description: 'Entdecken Sie innovative Finanzlösungen, die auf Ihr Profil zugeschnitten sind' },
        ],
        ctaText: 'Alternative Angebote entdecken',
      },
    ],
  },
  nl: {
    title: 'Onze Interventiebereiken',
    subtitle: 'Financieringsoplossingen aangepast aan al uw professionele en persoonlijke behoeften',
    sectors: [
      {
        title: 'Zakelijke Leningen',
        subtitle: 'uw werkkapitaal op afstand van een klik',
        description: 'Financiering ontworpen voor organisaties van alle grootten: oprichting, ontwikkeling en externe groei.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Apparatuumleningen', description: 'Maatwerk financiering voor aankoop van apparatuur en professionele materialen' },
          { title: 'Leasing', description: 'Flexibele verhuuroplossingen met koopoptie aan het einde van de periode' },
          { title: 'Factoring', description: 'Optimaliseer uw cashflow door uw vorderingen op klanten te verkopen' },
        ],
        ctaText: 'Zakelijke financiering aanvragen',
      },
      {
        title: 'Persoonlijke Leningen',
        subtitle: 'verwerkelijk uw levensdoelen',
        description: 'Verwezenlijk uw levensdoelen met maatwerk aanbiedingen: onroerend goed aankoop, mobiliteit, renovatie.',
        image: familyPlanningImg,
        features: [
          { title: 'Hypotheken', description: 'Verwezenlijk uw onroerendgoeddomen met gunstige voorwaarden en deskundige ondersteuning' },
          { title: 'Autoleningen', description: 'Flexibele financiering voor uw nieuwe of gebruikte voertuig' },
          { title: 'Renovatieleningen', description: 'Renoveer uw huis met op maat gemaakte financieringsoplossingen' },
        ],
        ctaText: 'Verken persoonlijke leningaanbiedingen',
      },
      {
        title: 'Schuldenconsolidatie',
        subtitle: 'beheer uw budget',
        description: 'Verlaag uw maandelijkse betalingen door uw leningen te consolideren. Zorg voor rustig financieel beheer.',
        image: renewableEnergyImg,
        features: [
          { title: 'Kredietaudit', description: 'Volledige analyse van uw financiële situatie en identificatie van kansen' },
          { title: 'Herstructurering', description: 'Intelligente reorganisatie van uw schulden om uw maandelijkse betalingen te verlagen' },
          { title: 'Optimalisatie', description: 'Verbeter uw cashflow en verhoog uw koopkracht' },
        ],
        ctaText: 'Raadpleeg voor schuldenconsolidatie',
      },
      {
        title: 'Alternatieve Aanbiedingen',
        subtitle: 'aangepast aan marktveranderingen',
        description: 'Moderne financiële producten die zich aanpassen aan marktveranderingen en opkomende behoeften.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Krijg toegang tot de nieuwste innovaties in financiële technologie en digitaal bankieren' },
          { title: 'Groen Financiering', description: 'Investeer in duurzame en ecologische projecten met positieve impact' },
          { title: 'Innovatieve Financiering', description: 'Ontdek innovatieve financieringsoplossingen afgestemd op uw profiel' },
        ],
        ctaText: 'Ontdek alternatieve aanbiedingen',
      },
    ],
  },
  hr: {
    title: 'Naša područja djelatnosti',
    subtitle: 'Rješenja financiranja prilagođena svim vašim poslovnim i osobnim potrebama',
    sectors: [
      {
        title: 'Krediti za poduzeća',
        subtitle: 'vaš obrtni kapital na dohvat ruke',
        description: 'Financiranja osmišljena za organizacije svih veličina: osnivanje, razvoj i vanjski rast.',
        image: businessProfessionalsImg,
        features: [
          { title: 'Krediti za opremu', description: 'Prilagođeno financiranje za nabavu opreme i profesionalnih materijala' },
          { title: 'Leasing', description: 'Fleksibilna rješenja najma s opcijom kupnje na kraju perioda' },
          { title: 'Faktoring', description: 'Optimizirajte novčani tok ustupanjem potraživanja od kupaca' },
        ],
        ctaText: 'Zatražite poslovno financiranje',
      },
      {
        title: 'Krediti za fizičke osobe',
        subtitle: 'ostvarite svoje životne projekte',
        description: 'Ostvarite svoje životne projekte uz prilagođene ponude: kupnja nekretnina, mobilnost, uređenje.',
        image: familyPlanningImg,
        features: [
          { title: 'Stambeni krediti', description: 'Ostvarite svoje nekretninske snove uz povoljne uvjete i stručnu podršku' },
          { title: 'Auto krediti', description: 'Fleksibilno financiranje za vaše novo ili rabljeno vozilo' },
          { title: 'Krediti za renovaciju', description: 'Uredite dom uz rješenja financiranja po mjeri' },
        ],
        ctaText: 'Istražite ponude za fizičke osobe',
      },
      {
        title: 'Konsolidacija dugova',
        subtitle: 'kontrolirajte svoj proračun',
        description: 'Smanjite mjesečne obroke konsolidacijom kredita. Osigurajte mirno financijsko upravljanje.',
        image: renewableEnergyImg,
        features: [
          { title: 'Kreditna revizija', description: 'Potpuna analiza vašeg financijskog stanja i identifikacija mogućnosti' },
          { title: 'Restrukturiranje', description: 'Pametna reorganizacija vaših dugova za smanjenje mjesečnih obroka' },
          { title: 'Optimizacija', description: 'Poboljšajte novčani tok i povećajte kupovnu moć' },
        ],
        ctaText: 'Konzultirajte se o konsolidaciji',
      },
      {
        title: 'Alternativne ponude',
        subtitle: 'prilagođene tržišnim promjenama',
        description: 'Moderni financijski proizvodi koji se prilagođavaju tržišnim promjenama i novim potrebama.',
        image: realEstateImg,
        features: [
          { title: 'Fintech', description: 'Pristupite najnovijim inovacijama u financijskim tehnologijama i digitalnom bankarstvu' },
          { title: 'Zelene financije', description: 'Ulagajte u održive i ekološke projekte s pozitivnim učinkom' },
          { title: 'Inovativne financije', description: 'Otkrijte inovativna financijska rješenja prilagođena vašem profilu' },
        ],
        ctaText: 'Otkrijte alternativne ponude',
      },
    ],
  },
};

export default function SectorsInterventionCards() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const data = translations[language as keyof typeof translations] || translations.hr;

  const getSectors = (): SectorSection[] => {
    return data.sectors.map(sector => ({
      ...sector,
      features: sector.features.map((f, idx) => ({
        icon: idx === 0 ? <TrendingUp className="h-5 w-5 text-accent" /> :
              idx === 1 ? <Lock className="h-5 w-5 text-accent" /> :
              <CheckCircle2 className="h-5 w-5 text-accent" />,
        title: f.title,
        description: f.description,
      })),
    }));
  };

  const sectors = getSectors();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Sectors - Alternating Layout */}
        <div className="space-y-24">
          {sectors.map((sector, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center"
              >
                {/* Image Section */}
                <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                  <div className="relative rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                </div>

                {/* Content Section */}
                <div className={isEven ? 'md:order-2' : 'md:order-1'}>
                  {/* Title */}
                  <h3 className="text-4xl font-bold text-foreground mb-2">
                    {sector.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xl text-foreground font-medium mb-4">
                    {sector.subtitle}
                  </p>

                  {/* Main Description */}
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    {sector.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {sector.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8 rounded-full font-semibold"
                    data-testid={`button-sector-cta-${index}`}
                    onClick={() => setLocation('/products')}
                  >
                    {sector.ctaText}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
