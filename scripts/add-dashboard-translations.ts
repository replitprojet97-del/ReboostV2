import * as fs from 'fs';

const newTranslations = {
  serverError: {
    es: 'No se puede conectar al servidor. Por favor, verifique su conexión e inténtelo de nuevo.',
    pt: 'Não foi possível conectar ao servidor. Por favor, verifique sua conexão e tente novamente.',
    it: 'Impossibile connettersi al server. Si prega di verificare la connessione e riprovare.',
    de: 'Verbindung zum Server nicht möglich. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    nl: 'Kan geen verbinding maken met de server. Controleer uw verbinding en probeer het opnieuw.',
  },
  diagnosticInfo: {
    es: 'Información de diagnóstico (desarrollo)',
    pt: 'Informações de diagnóstico (desenvolvimento)',
    it: 'Informazioni diagnostiche (sviluppo)',
    de: 'Diagnoseinformationen (Entwicklung)',
    nl: 'Diagnostische informatie (ontwikkeling)',
  },
  retry: {
    es: 'Reintentar',
    pt: 'Tentar novamente',
    it: 'Riprova',
    de: 'Erneut versuchen',
    nl: 'Opnieuw proberen',
  },
  financeOverview: {
    es: 'Aquí tiene una vista general de sus finanzas',
    pt: 'Aqui está uma visão geral de suas finanças',
    it: 'Ecco una panoramica delle tue finanze',
    de: 'Hier ist eine Übersicht Ihrer Finanzen',
    nl: 'Hier is een overzicht van uw financiën',
  },
  yourCreditLimit: {
    es: 'Su límite de crédito',
    pt: 'Seu limite de crédito',
    it: 'Il tuo limite di credito',
    de: 'Ihr Kreditlimit',
    nl: 'Uw kredietlimiet',
  },
  maximum: {
    es: 'Máximo',
    pt: 'Máximo',
    it: 'Massimo',
    de: 'Maximum',
    nl: 'Maximum',
  },
  activeLoanSingular: {
    es: 'préstamo activo',
    pt: 'empréstimo ativo',
    it: 'prestito attivo',
    de: 'aktives Darlehen',
    nl: 'actieve lening',
  },
  activeLoansPlural: {
    es: 'préstamos activos',
    pt: 'empréstimos ativos',
    it: 'prestiti attivi',
    de: 'aktive Darlehen',
    nl: 'actieve leningen',
  },
  loanNumber: {
    es: 'Préstamo #',
    pt: 'Empréstimo #',
    it: 'Prestito #',
    de: 'Darlehen #',
    nl: 'Lening #',
  },
  progression: {
    es: 'Progreso',
    pt: 'Progresso',
    it: 'Progresso',
    de: 'Fortschritt',
    nl: 'Voortgang',
  },
  nextSixMonths: {
    es: 'Próximos 6 meses',
    pt: 'Próximos 6 meses',
    it: 'Prossimi 6 mesi',
    de: 'Nächste 6 Monate',
    nl: 'Volgende 6 maanden',
  },
  repayment: {
    es: 'Reembolso',
    pt: 'Reembolso',
    it: 'Rimborso',
    de: 'Rückzahlung',
    nl: 'Terugbetaling',
  },
  noUpcomingRepayments: {
    es: 'Sin reembolsos próximos',
    pt: 'Sem reembolsos próximos',
    it: 'Nessun rimborso imminente',
    de: 'Keine bevorstehenden Rückzahlungen',
    nl: 'Geen aankomende terugbetalingen',
  },
  pendingContracts: {
    es: 'Contratos pendientes',
    pt: 'Contratos pendentes',
    it: 'Contratti in sospeso',
    de: 'Ausstehende Verträge',
    nl: 'Openstaande contracten',
  },
  contractsToSign: {
    es: 'contrato(s) para firmar',
    pt: 'contrato(s) para assinar',
    it: 'contratto/i da firmare',
    de: 'Vertrag/Verträge zu unterschreiben',
    nl: 'contract(en) te ondertekenen',
  },
  generatedOn: {
    es: 'Generado el',
    pt: 'Gerado em',
    it: 'Generato il',
    de: 'Erstellt am',
    nl: 'Gegenereerd op',
  },
  view: {
    es: 'Ver',
    pt: 'Ver',
    it: 'Vedi',
    de: 'Ansehen',
    nl: 'Bekijken',
  },
};

const filePath = 'client/src/lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');

const languages = ['es', 'pt', 'it', 'de', 'nl'];

for (const lang of languages) {
  // Find the dashboard section for this language and locate monthJun
  const dashboardRegex = new RegExp(`(${lang}:.*?dashboard: \\{[^}]*?monthJun: '[^']*',)`, 's');
  
  const match = content.match(dashboardRegex);
  if (!match) {
    console.error(`Could not find monthJun in dashboard section for ${lang}`);
    continue;
  }

  // Build the new keys string
  const newKeys = Object.keys(newTranslations).map(key => {
    return `      ${key}: '${newTranslations[key][lang]}',`;
  }).join('\n');

  // Replace after monthJun with new keys
  content = content.replace(dashboardRegex, `$1\n${newKeys}`);
  
  console.log(`✓ Added translations for ${lang}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✓ All translations added successfully!');
