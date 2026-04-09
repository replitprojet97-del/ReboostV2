// Title word translations for all languages
// Structure: Each language has 4 words that compose the title with different styling

export const titleTranslations = {
  en: [
    { text: "Financing", weight: "black" },
    { text: "excellence", weight: "gradient" },
    { text: "driving", weight: "semibold", separator: true },
    { text: "growth", weight: "bold" }
  ],
  fr: [
    { text: "Accompagner", weight: "black" },
    { text: "vos réussites", weight: "gradient" },
    { text: "soutenir", weight: "semibold", separator: true },
    { text: "vos initiatives", weight: "bold" }
  ],
  de: [
    { text: "Exzellenz", weight: "black" },
    { text: "finanzieren", weight: "gradient" },
    { text: "Wachstum", weight: "semibold", separator: true },
    { text: "antreiben", weight: "bold" }
  ],
  es: [
    { text: "Financiar", weight: "black" },
    { text: "la excelencia", weight: "gradient" },
    { text: "impulsar", weight: "semibold", separator: true },
    { text: "el crecimiento", weight: "bold" }
  ],
  it: [
    { text: "Finanziare", weight: "black" },
    { text: "l'eccellenza", weight: "gradient" },
    { text: "stimolare", weight: "semibold", separator: true },
    { text: "la crescita", weight: "bold" }
  ],
  pt: [
    { text: "Financiar", weight: "black" },
    { text: "a excelência", weight: "gradient" },
    { text: "impulsionar", weight: "semibold", separator: true },
    { text: "o crescimento", weight: "bold" }
  ],
  nl: [
    { text: "Excellentie", weight: "black" },
    { text: "financieren", weight: "gradient" },
    { text: "groei", weight: "semibold", separator: true },
    { text: "stimuleren", weight: "bold" }
  ],
  hr: [
    { text: "Financiranje", weight: "black" },
    { text: "izvrsnosti", weight: "gradient" },
    { text: "pokretanje", weight: "semibold", separator: true },
    { text: "rasta", weight: "bold" }
  ]
};

export type LanguageCode = keyof typeof titleTranslations;

export function getTitleWords(language: LanguageCode) {
  return titleTranslations[language] || titleTranslations.en;
}
