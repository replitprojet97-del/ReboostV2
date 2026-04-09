export const getStorytellingFeatures = (language: string): string[] => {
  const features: Record<string, string[]> = {
    fr: [
      'Processus transparent et sécurisé',
      'Approbation en 24-48 heures',
      'Taux compétitifs garantis'
    ],
    en: [
      'Transparent and secure process',
      'Approval in 24-48 hours',
      'Competitive rates guaranteed'
    ],
    es: [
      'Proceso transparente y seguro',
      'Aprobación en 24-48 horas',
      'Tasas competitivas garantizadas'
    ],
    pt: [
      'Processo transparente e seguro',
      'Aprovação em 24-48 horas',
      'Taxas competitivas garantidas'
    ],
    it: [
      'Processo trasparente e sicuro',
      'Approvazione in 24-48 ore',
      'Tassi competitivi garantiti'
    ],
    de: [
      'Transparenter und sicherer Prozess',
      'Genehmigung in 24-48 Stunden',
      'Konkurrenzfähige Zinssätze garantiert'
    ],
    nl: [
      'Transparant en veilig proces',
      'Goedkeuring in 24-48 uur',
      'Concurrerende tarieven gegarandeerd'
    ],
    hr: [
      'Transparentan i siguran proces',
      'Odobrenje u roku 24-48 sati',
      'Konkurentne kamatne stope zajamčene'
    ]
  };

  return features[language] || features.hr;
};
