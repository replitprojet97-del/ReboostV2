export interface Bank {
  id: string;
  name: string;
  country: string;
  countryName: string;
  bic: string;
  ibanFormat: string;
  ibanLength: number;
}

export const BANKS: Bank[] = [
  // FRANCE
  { id: "fr-bnp", name: "BNP Paribas", country: "FR", countryName: "France", bic: "BNPAFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-socgen", name: "Société Générale", country: "FR", countryName: "France", bic: "SOGEFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-creditagricole", name: "Crédit Agricole", country: "FR", countryName: "France", bic: "AGRIFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-creditm", name: "Crédit Mutuel", country: "FR", countryName: "France", bic: "CMCIFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-lcl", name: "LCL - Le Crédit Lyonnais", country: "FR", countryName: "France", bic: "LYCRFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-banquepop", name: "Banque Populaire", country: "FR", countryName: "France", bic: "CCBPFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-caissedepargne", name: "Caisse d'Épargne", country: "FR", countryName: "France", bic: "CEPAFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-labanquepostale", name: "La Banque Postale", country: "FR", countryName: "France", bic: "PSSTFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-bred", name: "BRED Banque Populaire", country: "FR", countryName: "France", bic: "BREDFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-hsbc", name: "HSBC France", country: "FR", countryName: "France", bic: "HSBCFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-ing", name: "ING Direct France", country: "FR", countryName: "France", bic: "INGDFRP1", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-boursorama", name: "Boursorama Banque", country: "FR", countryName: "France", bic: "BOUSFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-fortuneo", name: "Fortuneo Banque", country: "FR", countryName: "France", bic: "FTNOFRP1", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-n26", name: "N26 France", country: "FR", countryName: "France", bic: "NTSBDEB1", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "fr-revolut", name: "Revolut France", country: "FR", countryName: "France", bic: "REVOLT21", ibanFormat: "FR\\d{25}", ibanLength: 27 },

  // ALLEMAGNE
  { id: "de-deutschebank", name: "Deutsche Bank", country: "DE", countryName: "Allemagne", bic: "DEUTDEFF", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-commerzbank", name: "Commerzbank", country: "DE", countryName: "Allemagne", bic: "COBADEFF", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-dzbbank", name: "DZ Bank", country: "DE", countryName: "Allemagne", bic: "GENODEFF", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-unicredit", name: "UniCredit Bank", country: "DE", countryName: "Allemagne", bic: "HYVEDEMM", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-postbank", name: "Postbank", country: "DE", countryName: "Allemagne", bic: "PBNKDEFF", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-sparkasse", name: "Sparkasse", country: "DE", countryName: "Allemagne", bic: "WELADED1", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-volksbank", name: "Volksbank", country: "DE", countryName: "Allemagne", bic: "GENODED1", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-ing", name: "ING-DiBa", country: "DE", countryName: "Allemagne", bic: "INGDDEFF", ibanFormat: "DE\\d{20}", ibanLength: 22 },
  { id: "de-n26", name: "N26 Bank", country: "DE", countryName: "Allemagne", bic: "NTSBDEB1", ibanFormat: "DE\\d{20}", ibanLength: 22 },

  // ESPAGNE
  { id: "es-santander", name: "Banco Santander", country: "ES", countryName: "Espagne", bic: "BSCHESM", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-bbva", name: "BBVA", country: "ES", countryName: "Espagne", bic: "BBVAESMM", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-caixabank", name: "CaixaBank", country: "ES", countryName: "Espagne", bic: "CAIXESBB", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-bankia", name: "Bankia", country: "ES", countryName: "Espagne", bic: "CAHMESMM", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-sabadell", name: "Banco Sabadell", country: "ES", countryName: "Espagne", bic: "BSABESBB", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-bancopopular", name: "Banco Popular", country: "ES", countryName: "Espagne", bic: "POPUESM", ibanFormat: "ES\\d{22}", ibanLength: 24 },
  { id: "es-ing", name: "ING Direct España", country: "ES", countryName: "Espagne", bic: "INGDESM", ibanFormat: "ES\\d{22}", ibanLength: 24 },

  // ITALIE
  { id: "it-unicredit", name: "UniCredit", country: "IT", countryName: "Italie", bic: "UNCRITMM", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  { id: "it-intesa", name: "Intesa Sanpaolo", country: "IT", countryName: "Italie", bic: "BCITITMM", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  { id: "it-ubi", name: "UBI Banca", country: "IT", countryName: "Italie", bic: "BPMIITMM", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  { id: "it-mps", name: "Banca Monte dei Paschi di Siena", country: "IT", countryName: "Italie", bic: "PASCITMM", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  { id: "it-bnl", name: "BNL - BNP Paribas", country: "IT", countryName: "Italie", bic: "BNLIITRR", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  { id: "it-mediobanca", name: "Mediobanca", country: "IT", countryName: "Italie", bic: "MEDBITM", ibanFormat: "IT\\d{25}", ibanLength: 27 },
  
  // ROYAUME-UNI
  { id: "gb-hsbc", name: "HSBC UK Bank", country: "GB", countryName: "Royaume-Uni", bic: "HBUKGB4B", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-barclays", name: "Barclays Bank", country: "GB", countryName: "Royaume-Uni", bic: "BARCGB22", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-lloyds", name: "Lloyds Bank", country: "GB", countryName: "Royaume-Uni", bic: "LOYDGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-natwest", name: "NatWest", country: "GB", countryName: "Royaume-Uni", bic: "NWBKGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-rbs", name: "Royal Bank of Scotland", country: "GB", countryName: "Royaume-Uni", bic: "RBSSGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-santander", name: "Santander UK", country: "GB", countryName: "Royaume-Uni", bic: "ABBYGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-halifax", name: "Halifax", country: "GB", countryName: "Royaume-Uni", bic: "HLFXGB21", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-tsb", name: "TSB Bank", country: "GB", countryName: "Royaume-Uni", bic: "TSBSGB2A", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-metro", name: "Metro Bank", country: "GB", countryName: "Royaume-Uni", bic: "MYMBGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-revolut", name: "Revolut Ltd", country: "GB", countryName: "Royaume-Uni", bic: "REVOLT21", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-monzo", name: "Monzo Bank", country: "GB", countryName: "Royaume-Uni", bic: "MONZGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },
  { id: "gb-starling", name: "Starling Bank", country: "GB", countryName: "Royaume-Uni", bic: "SRLGGB2L", ibanFormat: "GB\\d{20}", ibanLength: 22 },

  // BELGIQUE
  { id: "be-kbc", name: "KBC Bank", country: "BE", countryName: "Belgique", bic: "KREDBEBB", ibanFormat: "BE\\d{14}", ibanLength: 16 },
  { id: "be-bnpparibas", name: "BNP Paribas Fortis", country: "BE", countryName: "Belgique", bic: "GEBABEBB", ibanFormat: "BE\\d{14}", ibanLength: 16 },
  { id: "be-ing", name: "ING Belgique", country: "BE", countryName: "Belgique", bic: "BBRUBEBB", ibanFormat: "BE\\d{14}", ibanLength: 16 },
  { id: "be-belfius", name: "Belfius Bank", country: "BE", countryName: "Belgique", bic: "GKCCBEBB", ibanFormat: "BE\\d{14}", ibanLength: 16 },
  { id: "be-argenta", name: "Argenta", country: "BE", countryName: "Belgique", bic: "ARSPBE22", ibanFormat: "BE\\d{14}", ibanLength: 16 },

  // PAYS-BAS
  { id: "nl-ing", name: "ING Bank", country: "NL", countryName: "Pays-Bas", bic: "INGBNL2A", ibanFormat: "NL\\d{16}", ibanLength: 18 },
  { id: "nl-abn", name: "ABN AMRO Bank", country: "NL", countryName: "Pays-Bas", bic: "ABNANL2A", ibanFormat: "NL\\d{16}", ibanLength: 18 },
  { id: "nl-rabobank", name: "Rabobank", country: "NL", countryName: "Pays-Bas", bic: "RABONL2U", ibanFormat: "NL\\d{16}", ibanLength: 18 },
  { id: "nl-sns", name: "SNS Bank", country: "NL", countryName: "Pays-Bas", bic: "SNSBNL2A", ibanFormat: "NL\\d{16}", ibanLength: 18 },
  { id: "nl-triodos", name: "Triodos Bank", country: "NL", countryName: "Pays-Bas", bic: "TRIONL2U", ibanFormat: "NL\\d{16}", ibanLength: 18 },
  { id: "nl-bunq", name: "bunq", country: "NL", countryName: "Pays-Bas", bic: "BUNQNL2A", ibanFormat: "NL\\d{16}", ibanLength: 18 },

  // LUXEMBOURG
  { id: "lu-bil", name: "Banque Internationale à Luxembourg", country: "LU", countryName: "Luxembourg", bic: "BILLLULL", ibanFormat: "LU\\d{18}", ibanLength: 20 },
  { id: "lu-bcee", name: "Banque et Caisse d'Épargne de l'État", country: "LU", countryName: "Luxembourg", bic: "BCEELULL", ibanFormat: "LU\\d{18}", ibanLength: 20 },
  { id: "lu-bnpparibas", name: "BNP Paribas Luxembourg", country: "LU", countryName: "Luxembourg", bic: "BPLULUPP", ibanFormat: "LU\\d{18}", ibanLength: 20 },
  { id: "lu-ing", name: "ING Luxembourg", country: "LU", countryName: "Luxembourg", bic: "CELLLULL", ibanFormat: "LU\\d{18}", ibanLength: 20 },

  // SUISSE
  { id: "ch-ubs", name: "UBS Switzerland", country: "CH", countryName: "Suisse", bic: "UBSWCHZH", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-credit", name: "Credit Suisse", country: "CH", countryName: "Suisse", bic: "CRESCHZZ", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-zkb", name: "Zürcher Kantonalbank", country: "CH", countryName: "Suisse", bic: "ZKBKCHZZ", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-raiffeisen", name: "Raiffeisen Switzerland", country: "CH", countryName: "Suisse", bic: "RAIFCH22", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-postfinance", name: "PostFinance", country: "CH", countryName: "Suisse", bic: "POFICHBE", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-bcv", name: "Banque Cantonale Vaudoise", country: "CH", countryName: "Suisse", bic: "BCVLCH2L", ibanFormat: "CH\\d{19}", ibanLength: 21 },
  { id: "ch-julius", name: "Julius Baer", country: "CH", countryName: "Suisse", bic: "BAERCHZZ", ibanFormat: "CH\\d{19}", ibanLength: 21 },

  // AUTRICHE
  { id: "at-erste", name: "Erste Bank", country: "AT", countryName: "Autriche", bic: "GIBAATWW", ibanFormat: "AT\\d{18}", ibanLength: 20 },
  { id: "at-raiffeisen", name: "Raiffeisen Bank", country: "AT", countryName: "Autriche", bic: "RZBAATWW", ibanFormat: "AT\\d{18}", ibanLength: 20 },
  { id: "at-bawag", name: "BAWAG P.S.K.", country: "AT", countryName: "Autriche", bic: "BAWAATWW", ibanFormat: "AT\\d{18}", ibanLength: 20 },
  { id: "at-unicredit", name: "UniCredit Bank Austria", country: "AT", countryName: "Autriche", bic: "BKAUATWW", ibanFormat: "AT\\d{18}", ibanLength: 20 },

  // PORTUGAL
  { id: "pt-millennium", name: "Millennium bcp", country: "PT", countryName: "Portugal", bic: "BBPIPTPL", ibanFormat: "PT\\d{23}", ibanLength: 25 },
  { id: "pt-caixa", name: "Caixa Geral de Depósitos", country: "PT", countryName: "Portugal", bic: "CGDIPTPL", ibanFormat: "PT\\d{23}", ibanLength: 25 },
  { id: "pt-santander", name: "Banco Santander Totta", country: "PT", countryName: "Portugal", bic: "TOTAPTPL", ibanFormat: "PT\\d{23}", ibanLength: 25 },
  { id: "pt-novobanco", name: "Novo Banco", country: "PT", countryName: "Portugal", bic: "BESCPTPL", ibanFormat: "PT\\d{23}", ibanLength: 25 },
  { id: "pt-bpi", name: "Banco BPI", country: "PT", countryName: "Portugal", bic: "BBPIPTPL", ibanFormat: "PT\\d{23}", ibanLength: 25 },

  // GRÈCE
  { id: "gr-national", name: "National Bank of Greece", country: "GR", countryName: "Grèce", bic: "ETHNGRAA", ibanFormat: "GR\\d{25}", ibanLength: 27 },
  { id: "gr-eurobank", name: "Eurobank", country: "GR", countryName: "Grèce", bic: "ERBKGRAA", ibanFormat: "GR\\d{25}", ibanLength: 27 },
  { id: "gr-alphabank", name: "Alpha Bank", country: "GR", countryName: "Grèce", bic: "CRBAGRAA", ibanFormat: "GR\\d{25}", ibanLength: 27 },
  { id: "gr-piraeus", name: "Piraeus Bank", country: "GR", countryName: "Grèce", bic: "PIRBGRAA", ibanFormat: "GR\\d{25}", ibanLength: 27 },

  // IRLANDE
  { id: "ie-boi", name: "Bank of Ireland", country: "IE", countryName: "Irlande", bic: "BOFIIE2D", ibanFormat: "IE\\d{20}", ibanLength: 22 },
  { id: "ie-aib", name: "Allied Irish Banks", country: "IE", countryName: "Irlande", bic: "AIBKIE2D", ibanFormat: "IE\\d{20}", ibanLength: 22 },
  { id: "ie-ulster", name: "Ulster Bank Ireland", country: "IE", countryName: "Irlande", bic: "ULSBIE2D", ibanFormat: "IE\\d{20}", ibanLength: 22 },
  { id: "ie-permanent", name: "Permanent TSB", country: "IE", countryName: "Irlande", bic: "IPBSIE2D", ibanFormat: "IE\\d{20}", ibanLength: 22 },

  // POLOGNE
  { id: "pl-pkobp", name: "PKO Bank Polski", country: "PL", countryName: "Pologne", bic: "BPKOPLPW", ibanFormat: "PL\\d{26}", ibanLength: 28 },
  { id: "pl-pekao", name: "Bank Pekao", country: "PL", countryName: "Pologne", bic: "PKOPPLPW", ibanFormat: "PL\\d{26}", ibanLength: 28 },
  { id: "pl-mbank", name: "mBank", country: "PL", countryName: "Pologne", bic: "BREXPLPW", ibanFormat: "PL\\d{26}", ibanLength: 28 },
  { id: "pl-ing", name: "ING Bank Śląski", country: "PL", countryName: "Pologne", bic: "INGBPLPW", ibanFormat: "PL\\d{26}", ibanLength: 28 },
  { id: "pl-santander", name: "Santander Bank Polska", country: "PL", countryName: "Pologne", bic: "WBKPPLPP", ibanFormat: "PL\\d{26}", ibanLength: 28 },

  // RÉPUBLIQUE TCHÈQUE
  { id: "cz-csob", name: "Československá obchodní banka", country: "CZ", countryName: "République Tchèque", bic: "CEKOCZPP", ibanFormat: "CZ\\d{22}", ibanLength: 24 },
  { id: "cz-kb", name: "Komerční banka", country: "CZ", countryName: "République Tchèque", bic: "KOMBCZPP", ibanFormat: "CZ\\d{22}", ibanLength: 24 },
  { id: "cz-csas", name: "Česká spořitelna", country: "CZ", countryName: "République Tchèque", bic: "GIBACZPX", ibanFormat: "CZ\\d{22}", ibanLength: 24 },
  { id: "cz-moneta", name: "Moneta Money Bank", country: "CZ", countryName: "République Tchèque", bic: "AGBACZPP", ibanFormat: "CZ\\d{22}", ibanLength: 24 },

  // DANEMARK
  { id: "dk-danske", name: "Danske Bank", country: "DK", countryName: "Danemark", bic: "DABADKKK", ibanFormat: "DK\\d{16}", ibanLength: 18 },
  { id: "dk-nordea", name: "Nordea Danmark", country: "DK", countryName: "Danemark", bic: "NDEADKKK", ibanFormat: "DK\\d{16}", ibanLength: 18 },
  { id: "dk-jyske", name: "Jyske Bank", country: "DK", countryName: "Danemark", bic: "JYBADKKK", ibanFormat: "DK\\d{16}", ibanLength: 18 },
  { id: "dk-sydbank", name: "Sydbank", country: "DK", countryName: "Danemark", bic: "SYBKDK22", ibanFormat: "DK\\d{16}", ibanLength: 18 },

  // SUÈDE
  { id: "se-handelsbanken", name: "Handelsbanken", country: "SE", countryName: "Suède", bic: "HANDSESS", ibanFormat: "SE\\d{22}", ibanLength: 24 },
  { id: "se-seb", name: "Skandinaviska Enskilda Banken", country: "SE", countryName: "Suède", bic: "ESSESESS", ibanFormat: "SE\\d{22}", ibanLength: 24 },
  { id: "se-swedbank", name: "Swedbank", country: "SE", countryName: "Suède", bic: "SWEDSESS", ibanFormat: "SE\\d{22}", ibanLength: 24 },
  { id: "se-nordea", name: "Nordea Bank", country: "SE", countryName: "Suède", bic: "NDEASESS", ibanFormat: "SE\\d{22}", ibanLength: 24 },

  // NORVÈGE
  { id: "no-dnb", name: "DNB Bank", country: "NO", countryName: "Norvège", bic: "DNBANOKK", ibanFormat: "NO\\d{13}", ibanLength: 15 },
  { id: "no-nordea", name: "Nordea Bank Norge", country: "NO", countryName: "Norvège", bic: "NDEANOKK", ibanFormat: "NO\\d{13}", ibanLength: 15 },
  { id: "no-handelsbanken", name: "Handelsbanken Norge", country: "NO", countryName: "Norvège", bic: "HANSNOKK", ibanFormat: "NO\\d{13}", ibanLength: 15 },
  { id: "no-sparebank", name: "SpareBank 1", country: "NO", countryName: "Norvège", bic: "SBANNO22", ibanFormat: "NO\\d{13}", ibanLength: 15 },

  // FINLANDE
  { id: "fi-nordea", name: "Nordea Bank Finland", country: "FI", countryName: "Finlande", bic: "NDEAFIHH", ibanFormat: "FI\\d{16}", ibanLength: 18 },
  { id: "fi-op", name: "OP Financial Group", country: "FI", countryName: "Finlande", bic: "OKOYFIHH", ibanFormat: "FI\\d{16}", ibanLength: 18 },
  { id: "fi-handelsbanken", name: "Handelsbanken Finland", country: "FI", countryName: "Finlande", bic: "HANDFIHH", ibanFormat: "FI\\d{16}", ibanLength: 18 },
  { id: "fi-danske", name: "Danske Bank Finland", country: "FI", countryName: "Finlande", bic: "DABAFIHH", ibanFormat: "FI\\d{16}", ibanLength: 18 },

  // ROUMANIE
  { id: "ro-bcr", name: "Banca Comercială Română", country: "RO", countryName: "Roumanie", bic: "RNCBROBU", ibanFormat: "RO\\d{22}", ibanLength: 24 },
  { id: "ro-brd", name: "BRD - Groupe Société Générale", country: "RO", countryName: "Roumanie", bic: "BRDEROBU", ibanFormat: "RO\\d{22}", ibanLength: 24 },
  { id: "ro-transilvania", name: "Banca Transilvania", country: "RO", countryName: "Roumanie", bic: "BTRLRO22", ibanFormat: "RO\\d{22}", ibanLength: 24 },
  { id: "ro-ing", name: "ING Bank Romania", country: "RO", countryName: "Roumanie", bic: "INGBROBU", ibanFormat: "RO\\d{22}", ibanLength: 24 },

  // HONGRIE
  { id: "hu-otp", name: "OTP Bank", country: "HU", countryName: "Hongrie", bic: "OTPVHUHB", ibanFormat: "HU\\d{26}", ibanLength: 28 },
  { id: "hu-erste", name: "Erste Bank Hungary", country: "HU", countryName: "Hongrie", bic: "GIBAHUHB", ibanFormat: "HU\\d{26}", ibanLength: 28 },
  { id: "hu-kh", name: "K&H Bank", country: "HU", countryName: "Hongrie", bic: "KHBHHU", ibanFormat: "HU\\d{26}", ibanLength: 28 },
  { id: "hu-unicredit", name: "UniCredit Bank Hungary", country: "HU", countryName: "Hongrie", bic: "BACXHUHB", ibanFormat: "HU\\d{26}", ibanLength: 28 },

  // ÉTATS-UNIS
  { id: "us-jpmorgan", name: "JP Morgan Chase Bank", country: "US", countryName: "États-Unis", bic: "CHASUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-bofa", name: "Bank of America", country: "US", countryName: "États-Unis", bic: "BOFAUS3N", ibanFormat: "", ibanLength: 0 },
  { id: "us-wells", name: "Wells Fargo Bank", country: "US", countryName: "États-Unis", bic: "WFBIUS6S", ibanFormat: "", ibanLength: 0 },
  { id: "us-citi", name: "Citibank", country: "US", countryName: "États-Unis", bic: "CITIUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-usbank", name: "U.S. Bank", country: "US", countryName: "États-Unis", bic: "USBKUS44", ibanFormat: "", ibanLength: 0 },
  { id: "us-pnc", name: "PNC Bank", country: "US", countryName: "États-Unis", bic: "PNCCUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-truist", name: "Truist Bank", country: "US", countryName: "États-Unis", bic: "SNTRUS3A", ibanFormat: "", ibanLength: 0 },
  { id: "us-td", name: "TD Bank", country: "US", countryName: "États-Unis", bic: "NRTHUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-capitalone", name: "Capital One", country: "US", countryName: "États-Unis", bic: "NFBKUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-chase", name: "Chase Bank", country: "US", countryName: "États-Unis", bic: "CHASUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-gs", name: "Goldman Sachs Bank", country: "US", countryName: "États-Unis", bic: "GSCMUS33", ibanFormat: "", ibanLength: 0 },
  { id: "us-ms", name: "Morgan Stanley", country: "US", countryName: "États-Unis", bic: "MSNYUS33", ibanFormat: "", ibanLength: 0 },

  // CANADA
  { id: "ca-rbc", name: "Royal Bank of Canada", country: "CA", countryName: "Canada", bic: "ROYCCAT2", ibanFormat: "", ibanLength: 0 },
  { id: "ca-td", name: "TD Canada Trust", country: "CA", countryName: "Canada", bic: "TDOMCATT", ibanFormat: "", ibanLength: 0 },
  { id: "ca-scotiabank", name: "Scotiabank", country: "CA", countryName: "Canada", bic: "NOSCCATT", ibanFormat: "", ibanLength: 0 },
  { id: "ca-bmo", name: "Bank of Montreal", country: "CA", countryName: "Canada", bic: "BOFMCAM2", ibanFormat: "", ibanLength: 0 },
  { id: "ca-cibc", name: "Canadian Imperial Bank of Commerce", country: "CA", countryName: "Canada", bic: "CIBCCATT", ibanFormat: "", ibanLength: 0 },
  { id: "ca-national", name: "National Bank of Canada", country: "CA", countryName: "Canada", bic: "BNDCCAMMINT", ibanFormat: "", ibanLength: 0 },
  { id: "ca-hsbc", name: "HSBC Bank Canada", country: "CA", countryName: "Canada", bic: "HKBCCATT", ibanFormat: "", ibanLength: 0 },
  { id: "ca-tangerine", name: "Tangerine Bank", country: "CA", countryName: "Canada", bic: "TNGCCATT", ibanFormat: "", ibanLength: 0 },

  // JAPON
  { id: "jp-mitsubishi", name: "MUFG Bank (Mitsubishi UFJ)", country: "JP", countryName: "Japon", bic: "BOTKJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-sumitomo", name: "Sumitomo Mitsui Banking Corporation", country: "JP", countryName: "Japon", bic: "SMBCJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-mizuho", name: "Mizuho Bank", country: "JP", countryName: "Japon", bic: "MHCBJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-resona", name: "Resona Bank", country: "JP", countryName: "Japon", bic: "DIWAJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-nomura", name: "Nomura Trust Bank", country: "JP", countryName: "Japon", bic: "NOMUJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-smtb", name: "Sumitomo Mitsui Trust Bank", country: "JP", countryName: "Japon", bic: "SMTBJPJT", ibanFormat: "", ibanLength: 0 },
  { id: "jp-japan", name: "Japan Post Bank", country: "JP", countryName: "Japon", bic: "JPPSJPJ1", ibanFormat: "", ibanLength: 0 },

  // CHINE
  { id: "cn-icbc", name: "Industrial and Commercial Bank of China", country: "CN", countryName: "Chine", bic: "ICBKCNBJ", ibanFormat: "", ibanLength: 0 },
  { id: "cn-ccb", name: "China Construction Bank", country: "CN", countryName: "Chine", bic: "PCBCCNBJ", ibanFormat: "", ibanLength: 0 },
  { id: "cn-abc", name: "Agricultural Bank of China", country: "CN", countryName: "Chine", bic: "ABOCCNBJ", ibanFormat: "", ibanLength: 0 },
  { id: "cn-boc", name: "Bank of China", country: "CN", countryName: "Chine", bic: "BKCHCNBJ", ibanFormat: "", ibanLength: 0 },
  { id: "cn-bocom", name: "Bank of Communications", country: "CN", countryName: "Chine", bic: "COMMCNSH", ibanFormat: "", ibanLength: 0 },
  { id: "cn-cmb", name: "China Merchants Bank", country: "CN", countryName: "Chine", bic: "CMBCCNBS", ibanFormat: "", ibanLength: 0 },
  { id: "cn-psbc", name: "Postal Savings Bank of China", country: "CN", countryName: "Chine", bic: "PSBTCNBJ", ibanFormat: "", ibanLength: 0 },

  // HONG KONG
  { id: "hk-hsbc", name: "HSBC Hong Kong", country: "HK", countryName: "Hong Kong", bic: "HSBCHKHH", ibanFormat: "", ibanLength: 0 },
  { id: "hk-bochk", name: "Bank of China (Hong Kong)", country: "HK", countryName: "Hong Kong", bic: "BKCHHKHH", ibanFormat: "", ibanLength: 0 },
  { id: "hk-hangseng", name: "Hang Seng Bank", country: "HK", countryName: "Hong Kong", bic: "HASEHKHH", ibanFormat: "", ibanLength: 0 },
  { id: "hk-scb", name: "Standard Chartered Bank (HK)", country: "HK", countryName: "Hong Kong", bic: "SCBLHKHH", ibanFormat: "", ibanLength: 0 },
  { id: "hk-dbs", name: "DBS Bank (Hong Kong)", country: "HK", countryName: "Hong Kong", bic: "DBSSHKHH", ibanFormat: "", ibanLength: 0 },

  // SINGAPOUR
  { id: "sg-dbs", name: "DBS Bank", country: "SG", countryName: "Singapour", bic: "DBSSSGSG", ibanFormat: "", ibanLength: 0 },
  { id: "sg-ocbc", name: "Oversea-Chinese Banking Corporation", country: "SG", countryName: "Singapour", bic: "OCBCSGSG", ibanFormat: "", ibanLength: 0 },
  { id: "sg-uob", name: "United Overseas Bank", country: "SG", countryName: "Singapour", bic: "UOVBSGSG", ibanFormat: "", ibanLength: 0 },
  { id: "sg-maybank", name: "Maybank Singapore", country: "SG", countryName: "Singapour", bic: "MBBESGSG", ibanFormat: "", ibanLength: 0 },
  { id: "sg-cimb", name: "CIMB Bank Singapore", country: "SG", countryName: "Singapour", bic: "CIBBSGSG", ibanFormat: "", ibanLength: 0 },

  // AUSTRALIE
  { id: "au-cba", name: "Commonwealth Bank of Australia", country: "AU", countryName: "Australie", bic: "CTBAAU2S", ibanFormat: "", ibanLength: 0 },
  { id: "au-anz", name: "ANZ Bank", country: "AU", countryName: "Australie", bic: "ANZBAU3M", ibanFormat: "", ibanLength: 0 },
  { id: "au-nab", name: "National Australia Bank", country: "AU", countryName: "Australie", bic: "NATAAU33", ibanFormat: "", ibanLength: 0 },
  { id: "au-westpac", name: "Westpac Banking Corporation", country: "AU", countryName: "Australie", bic: "WPACAU2S", ibanFormat: "", ibanLength: 0 },
  { id: "au-macquarie", name: "Macquarie Bank", country: "AU", countryName: "Australie", bic: "MACQAU2S", ibanFormat: "", ibanLength: 0 },

  // NOUVELLE-ZÉLANDE
  { id: "nz-anz", name: "ANZ Bank New Zealand", country: "NZ", countryName: "Nouvelle-Zélande", bic: "ANZBNZ22", ibanFormat: "", ibanLength: 0 },
  { id: "nz-asb", name: "ASB Bank", country: "NZ", countryName: "Nouvelle-Zélande", bic: "ASBBNZ2A", ibanFormat: "", ibanLength: 0 },
  { id: "nz-bnz", name: "Bank of New Zealand", country: "NZ", countryName: "Nouvelle-Zélande", bic: "BKNZNZ22", ibanFormat: "", ibanLength: 0 },
  { id: "nz-westpac", name: "Westpac New Zealand", country: "NZ", countryName: "Nouvelle-Zélande", bic: "WPACNZ2W", ibanFormat: "", ibanLength: 0 },
  { id: "nz-kiwibank", name: "Kiwibank", country: "NZ", countryName: "Nouvelle-Zélande", bic: "KIWINZ22", ibanFormat: "", ibanLength: 0 },

  // INDE
  { id: "in-sbi", name: "State Bank of India", country: "IN", countryName: "Inde", bic: "SBININBB", ibanFormat: "", ibanLength: 0 },
  { id: "in-hdfc", name: "HDFC Bank", country: "IN", countryName: "Inde", bic: "HDFCINBB", ibanFormat: "", ibanLength: 0 },
  { id: "in-icici", name: "ICICI Bank", country: "IN", countryName: "Inde", bic: "ICICINBB", ibanFormat: "", ibanLength: 0 },
  { id: "in-axis", name: "Axis Bank", country: "IN", countryName: "Inde", bic: "AXISINBB", ibanFormat: "", ibanLength: 0 },
  { id: "in-kotak", name: "Kotak Mahindra Bank", country: "IN", countryName: "Inde", bic: "KKBKINBB", ibanFormat: "", ibanLength: 0 },
  { id: "in-pnb", name: "Punjab National Bank", country: "IN", countryName: "Inde", bic: "PUNBINBB", ibanFormat: "", ibanLength: 0 },

  // CORÉE DU SUD
  { id: "kr-kb", name: "KB Kookmin Bank", country: "KR", countryName: "Corée du Sud", bic: "CZNBKRSE", ibanFormat: "", ibanLength: 0 },
  { id: "kr-sh", name: "Shinhan Bank", country: "KR", countryName: "Corée du Sud", bic: "SHBKKRSE", ibanFormat: "", ibanLength: 0 },
  { id: "kr-wr", name: "Woori Bank", country: "KR", countryName: "Corée du Sud", bic: "HVBKKRSE", ibanFormat: "", ibanLength: 0 },
  { id: "kr-hana", name: "KEB Hana Bank", country: "KR", countryName: "Corée du Sud", bic: "KOEXKRSE", ibanFormat: "", ibanLength: 0 },

  // BRÉSIL
  { id: "br-banco", name: "Banco do Brasil", country: "BR", countryName: "Brésil", bic: "BRASBRRJ", ibanFormat: "", ibanLength: 0 },
  { id: "br-itau", name: "Itaú Unibanco", country: "BR", countryName: "Brésil", bic: "ITAUBRSP", ibanFormat: "", ibanLength: 0 },
  { id: "br-bradesco", name: "Bradesco", country: "BR", countryName: "Brésil", bic: "BBDEBRSP", ibanFormat: "", ibanLength: 0 },
  { id: "br-caixa", name: "Caixa Econômica Federal", country: "BR", countryName: "Brésil", bic: "CEFXBRSP", ibanFormat: "", ibanLength: 0 },
  { id: "br-santander", name: "Banco Santander Brasil", country: "BR", countryName: "Brésil", bic: "BSCHBRSP", ibanFormat: "", ibanLength: 0 },
  { id: "br-nubank", name: "Nubank", country: "BR", countryName: "Brésil", bic: "NUCBBRRJ", ibanFormat: "", ibanLength: 0 },

  // ARGENTINE
  { id: "ar-nacion", name: "Banco de la Nación Argentina", country: "AR", countryName: "Argentine", bic: "NACNARBA", ibanFormat: "", ibanLength: 0 },
  { id: "ar-santander", name: "Banco Santander Río", country: "AR", countryName: "Argentine", bic: "BSCHARARX", ibanFormat: "", ibanLength: 0 },
  { id: "ar-bbva", name: "BBVA Argentina", country: "AR", countryName: "Argentine", bic: "BFRAARCB", ibanFormat: "", ibanLength: 0 },
  { id: "ar-galicia", name: "Banco Galicia", country: "AR", countryName: "Argentine", bic: "GABAARBA", ibanFormat: "", ibanLength: 0 },
  { id: "ar-macro", name: "Banco Macro", country: "AR", countryName: "Argentine", bic: "PRBANCAR", ibanFormat: "", ibanLength: 0 },

  // MEXIQUE
  { id: "mx-bbva", name: "BBVA Bancomer", country: "MX", countryName: "Mexique", bic: "BCMRMXMM", ibanFormat: "", ibanLength: 0 },
  { id: "mx-banorte", name: "Banorte", country: "MX", countryName: "Mexique", bic: "MENOMXMT", ibanFormat: "", ibanLength: 0 },
  { id: "mx-santander", name: "Banco Santander México", country: "MX", countryName: "Mexique", bic: "BMSXMXMM", ibanFormat: "", ibanLength: 0 },
  { id: "mx-citibanamex", name: "Citibanamex", country: "MX", countryName: "Mexique", bic: "BNMXMXMM", ibanFormat: "", ibanLength: 0 },
  { id: "mx-hsbc", name: "HSBC México", country: "MX", countryName: "Mexique", bic: "BIMEMXMM", ibanFormat: "", ibanLength: 0 },
  { id: "mx-scotiabank", name: "Scotiabank México", country: "MX", countryName: "Mexique", bic: "MBCOMXMM", ibanFormat: "", ibanLength: 0 },

  // CHILI
  { id: "cl-santander", name: "Banco Santander Chile", country: "CL", countryName: "Chili", bic: "BSCHCLRM", ibanFormat: "", ibanLength: 0 },
  { id: "cl-chile", name: "Banco de Chile", country: "CL", countryName: "Chili", bic: "BCHICLRM", ibanFormat: "", ibanLength: 0 },
  { id: "cl-estado", name: "BancoEstado", country: "CL", countryName: "Chili", bic: "BECHCLRM", ibanFormat: "", ibanLength: 0 },
  { id: "cl-bci", name: "Banco de Crédito e Inversiones", country: "CL", countryName: "Chili", bic: "CREDCLRM", ibanFormat: "", ibanLength: 0 },
  { id: "cl-scotiabank", name: "Scotiabank Chile", country: "CL", countryName: "Chili", bic: "STBCCLRM", ibanFormat: "", ibanLength: 0 },

  // COLOMBIE
  { id: "co-bancolombia", name: "Bancolombia", country: "CO", countryName: "Colombie", bic: "COLOCOBB", ibanFormat: "", ibanLength: 0 },
  { id: "co-banco", name: "Banco de Bogotá", country: "CO", countryName: "Colombie", bic: "BBOPCOBB", ibanFormat: "", ibanLength: 0 },
  { id: "co-davivienda", name: "Banco Davivienda", country: "CO", countryName: "Colombie", bic: "CAFECOBB", ibanFormat: "", ibanLength: 0 },
  { id: "co-bbva", name: "BBVA Colombia", country: "CO", countryName: "Colombie", bic: "BBVACOBB", ibanFormat: "", ibanLength: 0 },

  // PÉROU
  { id: "pe-bcp", name: "Banco de Crédito del Perú", country: "PE", countryName: "Pérou", bic: "BCPLPEPL", ibanFormat: "", ibanLength: 0 },
  { id: "pe-bbva", name: "BBVA Perú", country: "PE", countryName: "Pérou", bic: "BCONPEPL", ibanFormat: "", ibanLength: 0 },
  { id: "pe-scotiabank", name: "Scotiabank Perú", country: "PE", countryName: "Pérou", bic: "WIITPEPL", ibanFormat: "", ibanLength: 0 },
  { id: "pe-interbank", name: "Interbank", country: "PE", countryName: "Pérou", bic: "BINPPEPL", ibanFormat: "", ibanLength: 0 },

  // ÉMIRATS ARABES UNIS
  { id: "ae-emirates", name: "Emirates NBD", country: "AE", countryName: "Émirats Arabes Unis", bic: "EBILAEAD", ibanFormat: "AE\\d{21}", ibanLength: 23 },
  { id: "ae-adcb", name: "Abu Dhabi Commercial Bank", country: "AE", countryName: "Émirats Arabes Unis", bic: "ADCBAEAA", ibanFormat: "AE\\d{21}", ibanLength: 23 },
  { id: "ae-fab", name: "First Abu Dhabi Bank", country: "AE", countryName: "Émirats Arabes Unis", bic: "NBADAEAA", ibanFormat: "AE\\d{21}", ibanLength: 23 },
  { id: "ae-enbd", name: "Emirates Islamic Bank", country: "AE", countryName: "Émirats Arabes Unis", bic: "MEBLAEAA", ibanFormat: "AE\\d{21}", ibanLength: 23 },
  { id: "ae-mashreq", name: "Mashreq Bank", country: "AE", countryName: "Émirats Arabes Unis", bic: "MSHQAEAA", ibanFormat: "AE\\d{21}", ibanLength: 23 },
  { id: "ae-cbd", name: "Commercial Bank of Dubai", country: "AE", countryName: "Émirats Arabes Unis", bic: "CBDUAEAA", ibanFormat: "AE\\d{21}", ibanLength: 23 },

  // ARABIE SAOUDITE
  { id: "sa-ncb", name: "National Commercial Bank", country: "SA", countryName: "Arabie Saoudite", bic: "NCBKSAJE", ibanFormat: "SA\\d{22}", ibanLength: 24 },
  { id: "sa-rajhi", name: "Al Rajhi Bank", country: "SA", countryName: "Arabie Saoudite", bic: "RJHISARI", ibanFormat: "SA\\d{22}", ibanLength: 24 },
  { id: "sa-samba", name: "Samba Financial Group", country: "SA", countryName: "Arabie Saoudite", bic: "SAMBSARI", ibanFormat: "SA\\d{22}", ibanLength: 24 },
  { id: "sa-riyad", name: "Riyad Bank", country: "SA", countryName: "Arabie Saoudite", bic: "RIBLSARI", ibanFormat: "SA\\d{22}", ibanLength: 24 },
  { id: "sa-sab", name: "Saudi British Bank", country: "SA", countryName: "Arabie Saoudite", bic: "SABBSARI", ibanFormat: "SA\\d{22}", ibanLength: 24 },

  // QATAR
  { id: "qa-qnb", name: "Qatar National Bank", country: "QA", countryName: "Qatar", bic: "QNBAQAQA", ibanFormat: "QA\\d{27}", ibanLength: 29 },
  { id: "qa-dib", name: "Doha Bank", country: "QA", countryName: "Qatar", bic: "DOHBQAQA", ibanFormat: "QA\\d{27}", ibanLength: 29 },
  { id: "qa-cb", name: "Commercial Bank of Qatar", country: "QA", countryName: "Qatar", bic: "CBQAQAQA", ibanFormat: "QA\\d{27}", ibanLength: 29 },
  { id: "qa-mashreq", name: "Mashreq Bank Qatar", country: "QA", countryName: "Qatar", bic: "MSHQQAQA", ibanFormat: "QA\\d{27}", ibanLength: 29 },

  // KOWEÏT
  { id: "kw-nbk", name: "National Bank of Kuwait", country: "KW", countryName: "Koweït", bic: "NBOKKWKW", ibanFormat: "KW\\d{28}", ibanLength: 30 },
  { id: "kw-gb", name: "Gulf Bank Kuwait", country: "KW", countryName: "Koweït", bic: "GULBKWKW", ibanFormat: "KW\\d{28}", ibanLength: 30 },
  { id: "kw-cb", name: "Commercial Bank of Kuwait", country: "KW", countryName: "Koweït", bic: "COKWKWKW", ibanFormat: "KW\\d{28}", ibanLength: 30 },
  { id: "kw-burgan", name: "Burgan Bank", country: "KW", countryName: "Koweït", bic: "BUBKKWKW", ibanFormat: "KW\\d{28}", ibanLength: 30 },

  // TURQUIE
  { id: "tr-is", name: "İş Bankası", country: "TR", countryName: "Turquie", bic: "ISBKTRIS", ibanFormat: "TR\\d{24}", ibanLength: 26 },
  { id: "tr-garanti", name: "Garanti BBVA", country: "TR", countryName: "Turquie", bic: "TGBATRIS", ibanFormat: "TR\\d{24}", ibanLength: 26 },
  { id: "tr-yapı", name: "Yapı Kredi", country: "TR", countryName: "Turquie", bic: "YAPITRIS", ibanFormat: "TR\\d{24}", ibanLength: 26 },
  { id: "tr-akbank", name: "Akbank", country: "TR", countryName: "Turquie", bic: "AKBKTRIS", ibanFormat: "TR\\d{24}", ibanLength: 26 },
  { id: "tr-ziraat", name: "Ziraat Bankası", country: "TR", countryName: "Turquie", bic: "TCZBTR2A", ibanFormat: "TR\\d{24}", ibanLength: 26 },

  // ISRAËL
  { id: "il-leumi", name: "Bank Leumi", country: "IL", countryName: "Israël", bic: "LUMIILITX", ibanFormat: "IL\\d{21}", ibanLength: 23 },
  { id: "il-hapoalim", name: "Bank Hapoalim", country: "IL", countryName: "Israël", bic: "POALILIT", ibanFormat: "IL\\d{21}", ibanLength: 23 },
  { id: "il-discount", name: "Israel Discount Bank", country: "IL", countryName: "Israël", bic: "IDBLILTX", ibanFormat: "IL\\d{21}", ibanLength: 23 },
  { id: "il-mizrahi", name: "Mizrahi Tefahot Bank", country: "IL", countryName: "Israël", bic: "MIZBILIT", ibanFormat: "IL\\d{21}", ibanLength: 23 },

  // MALAISIE
  { id: "my-maybank", name: "Maybank", country: "MY", countryName: "Malaisie", bic: "MBBEMYKL", ibanFormat: "", ibanLength: 0 },
  { id: "my-cimb", name: "CIMB Bank", country: "MY", countryName: "Malaisie", bic: "CIBBMYKL", ibanFormat: "", ibanLength: 0 },
  { id: "my-pbb", name: "Public Bank Berhad", country: "MY", countryName: "Malaisie", bic: "PBBEMYKL", ibanFormat: "", ibanLength: 0 },
  { id: "my-rhb", name: "RHB Bank", country: "MY", countryName: "Malaisie", bic: "RHBBMYKL", ibanFormat: "", ibanLength: 0 },
  { id: "my-hong", name: "Hong Leong Bank", country: "MY", countryName: "Malaisie", bic: "HLBBMYKL", ibanFormat: "", ibanLength: 0 },

  // THAÏLANDE
  { id: "th-bangkok", name: "Bangkok Bank", country: "TH", countryName: "Thaïlande", bic: "BKKBTHBK", ibanFormat: "", ibanLength: 0 },
  { id: "th-krungsri", name: "Krungsri Bank", country: "TH", countryName: "Thaïlande", bic: "AYUDTHBK", ibanFormat: "", ibanLength: 0 },
  { id: "th-kasikorn", name: "Kasikornbank", country: "TH", countryName: "Thaïlande", bic: "KASITHBK", ibanFormat: "", ibanLength: 0 },
  { id: "th-siam", name: "Siam Commercial Bank", country: "TH", countryName: "Thaïlande", bic: "SICOTHBK", ibanFormat: "", ibanLength: 0 },
  { id: "th-krungthai", name: "Krungthai Bank", country: "TH", countryName: "Thaïlande", bic: "KRTHTHBK", ibanFormat: "", ibanLength: 0 },

  // INDONÉSIE
  { id: "id-bri", name: "Bank Rakyat Indonesia", country: "ID", countryName: "Indonésie", bic: "BRINIDJA", ibanFormat: "", ibanLength: 0 },
  { id: "id-mandiri", name: "Bank Mandiri", country: "ID", countryName: "Indonésie", bic: "BMRIIDJA", ibanFormat: "", ibanLength: 0 },
  { id: "id-bca", name: "Bank Central Asia", country: "ID", countryName: "Indonésie", bic: "CENAIDJA", ibanFormat: "", ibanLength: 0 },
  { id: "id-bni", name: "Bank Negara Indonesia", country: "ID", countryName: "Indonésie", bic: "BNINIDJA", ibanFormat: "", ibanLength: 0 },

  // PHILIPPINES
  { id: "ph-bdo", name: "BDO Unibank", country: "PH", countryName: "Philippines", bic: "BNORPHMM", ibanFormat: "", ibanLength: 0 },
  { id: "ph-metrobank", name: "Metropolitan Bank & Trust Company", country: "PH", countryName: "Philippines", bic: "MBTCPHMM", ibanFormat: "", ibanLength: 0 },
  { id: "ph-bpi", name: "Bank of the Philippine Islands", country: "PH", countryName: "Philippines", bic: "BOPIPHMM", ibanFormat: "", ibanLength: 0 },
  { id: "ph-land", name: "Land Bank of the Philippines", country: "PH", countryName: "Philippines", bic: "TLBPPHMM", ibanFormat: "", ibanLength: 0 },

  // VIETNAM
  { id: "vn-vietcombank", name: "Vietcombank", country: "VN", countryName: "Vietnam", bic: "BFTVVNVX", ibanFormat: "", ibanLength: 0 },
  { id: "vn-bidv", name: "BIDV", country: "VN", countryName: "Vietnam", bic: "BIDVVNVX", ibanFormat: "", ibanLength: 0 },
  { id: "vn-vietinbank", name: "Vietinbank", country: "VN", countryName: "Vietnam", bic: "ICBVVNVX", ibanFormat: "", ibanLength: 0 },
  { id: "vn-agribank", name: "Agribank", country: "VN", countryName: "Vietnam", bic: "VBAAVNVX", ibanFormat: "", ibanLength: 0 },

  // AUTRES PAYS EUROPÉENS
  // Slovaquie
  { id: "sk-vub", name: "Všeobecná úverová banka", country: "SK", countryName: "Slovaquie", bic: "SUBASKBX", ibanFormat: "SK\\d{22}", ibanLength: 24 },
  { id: "sk-tatrabanka", name: "Tatra banka", country: "SK", countryName: "Slovaquie", bic: "TATRSKBX", ibanFormat: "SK\\d{22}", ibanLength: 24 },
  { id: "sk-slsp", name: "Slovenská sporiteľňa", country: "SK", countryName: "Slovaquie", bic: "GIBASKBX", ibanFormat: "SK\\d{22}", ibanLength: 24 },

  // Slovénie
  { id: "si-nlb", name: "Nova Ljubljanska banka", country: "SI", countryName: "Slovénie", bic: "LJBASI2X", ibanFormat: "SI\\d{17}", ibanLength: 19 },
  { id: "si-skb", name: "SKB banka", country: "SI", countryName: "Slovénie", bic: "SKBASI2X", ibanFormat: "SI\\d{17}", ibanLength: 19 },

  // Croatie
  { id: "hr-zagrebacka", name: "Zagrebačka banka", country: "HR", countryName: "Croatie", bic: "ZABAHR2X", ibanFormat: "HR\\d{19}", ibanLength: 21 },
  { id: "hr-pbz", name: "Privredna banka Zagreb", country: "HR", countryName: "Croatie", bic: "PBZGHR2X", ibanFormat: "HR\\d{19}", ibanLength: 21 },

  // Bulgarie
  { id: "bg-ubb", name: "United Bulgarian Bank", country: "BG", countryName: "Bulgarie", bic: "UBBSBGSF", ibanFormat: "BG\\d{20}", ibanLength: 22 },
  { id: "bg-dsb", name: "DSK Bank", country: "BG", countryName: "Bulgarie", bic: "STSBG2S", ibanFormat: "BG\\d{20}", ibanLength: 22 },
  { id: "bg-first", name: "First Investment Bank", country: "BG", countryName: "Bulgarie", bic: "FINVBGSF", ibanFormat: "BG\\d{20}", ibanLength: 22 },

  // Lituanie
  { id: "lt-sb", name: "SEB bankas", country: "LT", countryName: "Lituanie", bic: "CBVILT2X", ibanFormat: "LT\\d{18}", ibanLength: 20 },
  { id: "lt-swedbank", name: "Swedbank Lithuania", country: "LT", countryName: "Lituanie", bic: "HABALT22", ibanFormat: "LT\\d{18}", ibanLength: 20 },
  { id: "lt-luminor", name: "Luminor Bank Lithuania", country: "LT", countryName: "Lituanie", bic: "AGBLLT2X", ibanFormat: "LT\\d{18}", ibanLength: 20 },

  // Lettonie
  { id: "lv-swedbank", name: "Swedbank Latvia", country: "LV", countryName: "Lettonie", bic: "HABALV22", ibanFormat: "LV\\d{19}", ibanLength: 21 },
  { id: "lv-seb", name: "SEB banka", country: "LV", countryName: "Lettonie", bic: "UNLALV2X", ibanFormat: "LV\\d{19}", ibanLength: 21 },

  // Estonie
  { id: "ee-swedbank", name: "Swedbank Estonia", country: "EE", countryName: "Estonie", bic: "HABAEE2X", ibanFormat: "EE\\d{18}", ibanLength: 20 },
  { id: "ee-seb", name: "SEB Pank", country: "EE", countryName: "Estonie", bic: "EEUHEE2X", ibanFormat: "EE\\d{18}", ibanLength: 20 },

  // Islande
  { id: "is-land", name: "Landsbankinn", country: "IS", countryName: "Islande", bic: "NBIIISRE", ibanFormat: "IS\\d{24}", ibanLength: 26 },
  { id: "is-arion", name: "Arion Bank", country: "IS", countryName: "Islande", bic: "KAUPIS21", ibanFormat: "IS\\d{24}", ibanLength: 26 },

  // Monaco
  { id: "mc-cfm", name: "Compagnie Monégasque de Banque", country: "MC", countryName: "Monaco", bic: "CMBRMC2M", ibanFormat: "MC\\d{25}", ibanLength: 27 },
  { id: "mc-credit", name: "Crédit Suisse Monaco", country: "MC", countryName: "Monaco", bic: "CRESMCMX", ibanFormat: "MC\\d{25}", ibanLength: 27 },

  // Malte
  { id: "mt-hsbc", name: "HSBC Bank Malta", country: "MT", countryName: "Malte", bic: "MMEBMTMT", ibanFormat: "MT\\d{29}", ibanLength: 31 },
  { id: "mt-bov", name: "Bank of Valletta", country: "MT", countryName: "Malte", bic: "VALLMTMT", ibanFormat: "MT\\d{29}", ibanLength: 31 },

  // Chypre
  { id: "cy-boc", name: "Bank of Cyprus", country: "CY", countryName: "Chypre", bic: "BCYPCY2N", ibanFormat: "CY\\d{26}", ibanLength: 28 },
  { id: "cy-hellenic", name: "Hellenic Bank", country: "CY", countryName: "Chypre", bic: "HEBACY2N", ibanFormat: "CY\\d{26}", ibanLength: 28 },

  // PORTO RICO (Territoire US - utilise le systeme bancaire americain)
  { id: "pr-bppr", name: "Banco Popular de Puerto Rico", country: "PR", countryName: "Porto Rico", bic: "BPPRPRSP", ibanFormat: "", ibanLength: 0 },
  { id: "pr-firstbank", name: "FirstBank Puerto Rico", country: "PR", countryName: "Porto Rico", bic: "FBTPPRSP", ibanFormat: "", ibanLength: 0 },
  { id: "pr-oriental", name: "Oriental Bank", country: "PR", countryName: "Porto Rico", bic: "ORIPPRSP", ibanFormat: "", ibanLength: 0 },
  { id: "pr-santander", name: "Banco Santander Puerto Rico", country: "PR", countryName: "Porto Rico", bic: "BSCHPRSP", ibanFormat: "", ibanLength: 0 },
  { id: "pr-scotiabank", name: "Scotiabank Puerto Rico", country: "PR", countryName: "Porto Rico", bic: "NABORPRP", ibanFormat: "", ibanLength: 0 },

  // ILES VIERGES AMERICAINES (Territoire US)
  { id: "vi-firstbank", name: "FirstBank Virgin Islands", country: "VI", countryName: "Iles Vierges americaines", bic: "FBTPVIV1", ibanFormat: "", ibanLength: 0 },
  { id: "vi-bpvi", name: "Banco Popular de Virgin Islands", country: "VI", countryName: "Iles Vierges americaines", bic: "BPOPVIV1", ibanFormat: "", ibanLength: 0 },

  // GUAM (Territoire US)
  { id: "gu-bankofguam", name: "Bank of Guam", country: "GU", countryName: "Guam", bic: "BOGUGUM1", ibanFormat: "", ibanLength: 0 },
  { id: "gu-firsthawaiian", name: "First Hawaiian Bank Guam", country: "GU", countryName: "Guam", bic: "FHBKGUM1", ibanFormat: "", ibanLength: 0 },

  // TAIWAN
  { id: "tw-cathay", name: "Cathay United Bank", country: "TW", countryName: "Taiwan", bic: "CATHTWTX", ibanFormat: "", ibanLength: 0 },
  { id: "tw-megabank", name: "Mega International Commercial Bank", country: "TW", countryName: "Taiwan", bic: "ICBKTWTP", ibanFormat: "", ibanLength: 0 },
  { id: "tw-ctbc", name: "CTBC Bank", country: "TW", countryName: "Taiwan", bic: "CTCBTWTP", ibanFormat: "", ibanLength: 0 },
  { id: "tw-esun", name: "E.SUN Commercial Bank", country: "TW", countryName: "Taiwan", bic: "ESUNTWTP", ibanFormat: "", ibanLength: 0 },
  { id: "tw-fubon", name: "Taipei Fubon Commercial Bank", country: "TW", countryName: "Taiwan", bic: "TPBKTWTP", ibanFormat: "", ibanLength: 0 },

  // EGYPTE
  { id: "eg-nbe", name: "National Bank of Egypt", country: "EG", countryName: "Egypte", bic: "NBEGEGCX", ibanFormat: "EG\\d{27}", ibanLength: 29 },
  { id: "eg-cib", name: "Commercial International Bank", country: "EG", countryName: "Egypte", bic: "CIBEEGCX", ibanFormat: "EG\\d{27}", ibanLength: 29 },
  { id: "eg-qnb", name: "QNB Alahli", country: "EG", countryName: "Egypte", bic: "QNBAEGCX", ibanFormat: "EG\\d{27}", ibanLength: 29 },
  { id: "eg-alex", name: "Bank of Alexandria", country: "EG", countryName: "Egypte", bic: "ALEXEGCX", ibanFormat: "EG\\d{27}", ibanLength: 29 },

  // AFRIQUE DU SUD
  { id: "za-standard", name: "Standard Bank", country: "ZA", countryName: "Afrique du Sud", bic: "SBZAZAJJ", ibanFormat: "", ibanLength: 0 },
  { id: "za-absa", name: "Absa Bank", country: "ZA", countryName: "Afrique du Sud", bic: "ABSAZAJJ", ibanFormat: "", ibanLength: 0 },
  { id: "za-fnb", name: "First National Bank", country: "ZA", countryName: "Afrique du Sud", bic: "FIRNZAJJ", ibanFormat: "", ibanLength: 0 },
  { id: "za-nedbank", name: "Nedbank", country: "ZA", countryName: "Afrique du Sud", bic: "NEDSZAJJ", ibanFormat: "", ibanLength: 0 },
  { id: "za-capitec", name: "Capitec Bank", country: "ZA", countryName: "Afrique du Sud", bic: "CABORAJJ", ibanFormat: "", ibanLength: 0 },

  // NIGERIA
  { id: "ng-zenith", name: "Zenith Bank", country: "NG", countryName: "Nigeria", bic: "ZEABORLA", ibanFormat: "", ibanLength: 0 },
  { id: "ng-gtb", name: "Guaranty Trust Bank", country: "NG", countryName: "Nigeria", bic: "GTBINGLA", ibanFormat: "", ibanLength: 0 },
  { id: "ng-firstbank", name: "First Bank of Nigeria", country: "NG", countryName: "Nigeria", bic: "FABORNGLA", ibanFormat: "", ibanLength: 0 },
  { id: "ng-uba", name: "United Bank for Africa", country: "NG", countryName: "Nigeria", bic: "UNABORLA", ibanFormat: "", ibanLength: 0 },
  { id: "ng-access", name: "Access Bank", country: "NG", countryName: "Nigeria", bic: "AABORNGLA", ibanFormat: "", ibanLength: 0 },

  // KENYA
  { id: "ke-equity", name: "Equity Bank Kenya", country: "KE", countryName: "Kenya", bic: "EABORKEN", ibanFormat: "", ibanLength: 0 },
  { id: "ke-kcb", name: "Kenya Commercial Bank", country: "KE", countryName: "Kenya", bic: "KCBLKENX", ibanFormat: "", ibanLength: 0 },
  { id: "ke-coop", name: "Co-operative Bank of Kenya", country: "KE", countryName: "Kenya", bic: "COOPKENA", ibanFormat: "", ibanLength: 0 },
  { id: "ke-standard", name: "Standard Chartered Kenya", country: "KE", countryName: "Kenya", bic: "SCBLKENX", ibanFormat: "", ibanLength: 0 },

  // GHANA
  { id: "gh-gcb", name: "GCB Bank", country: "GH", countryName: "Ghana", bic: "GHCBGHAC", ibanFormat: "", ibanLength: 0 },
  { id: "gh-ecobank", name: "Ecobank Ghana", country: "GH", countryName: "Ghana", bic: "ECORGH", ibanFormat: "", ibanLength: 0 },
  { id: "gh-absa", name: "Absa Bank Ghana", country: "GH", countryName: "Ghana", bic: "BABORGH", ibanFormat: "", ibanLength: 0 },

  // MAROC
  { id: "ma-attijariwafa", name: "Attijariwafa Bank", country: "MA", countryName: "Maroc", bic: "BCMAMAMC", ibanFormat: "MA\\d{26}", ibanLength: 28 },
  { id: "ma-bp", name: "Banque Populaire Maroc", country: "MA", countryName: "Maroc", bic: "BCPOMAMC", ibanFormat: "MA\\d{26}", ibanLength: 28 },
  { id: "ma-bmce", name: "Bank of Africa Morocco", country: "MA", countryName: "Maroc", bic: "BMABORMC", ibanFormat: "MA\\d{26}", ibanLength: 28 },
  { id: "ma-sgma", name: "Societe Generale Maroc", country: "MA", countryName: "Maroc", bic: "SGMBMAMC", ibanFormat: "MA\\d{26}", ibanLength: 28 },

  // TUNISIE
  { id: "tn-biat", name: "BIAT", country: "TN", countryName: "Tunisie", bic: "BIATTNTT", ibanFormat: "TN\\d{22}", ibanLength: 24 },
  { id: "tn-stb", name: "Societe Tunisienne de Banque", country: "TN", countryName: "Tunisie", bic: "STBKTNTT", ibanFormat: "TN\\d{22}", ibanLength: 24 },
  { id: "tn-amen", name: "Amen Bank", country: "TN", countryName: "Tunisie", bic: "AMNKTNTT", ibanFormat: "TN\\d{22}", ibanLength: 24 },

  // UKRAINE
  { id: "ua-privatbank", name: "PrivatBank", country: "UA", countryName: "Ukraine", bic: "PABORUA", ibanFormat: "UA\\d{27}", ibanLength: 29 },
  { id: "ua-oschadbank", name: "Oschadbank", country: "UA", countryName: "Ukraine", bic: "OSCRABOUA", ibanFormat: "UA\\d{27}", ibanLength: 29 },
  { id: "ua-raiffeisen", name: "Raiffeisen Bank Aval", country: "UA", countryName: "Ukraine", bic: "AVALUAUK", ibanFormat: "UA\\d{27}", ibanLength: 29 },

  // GEORGIE
  { id: "ge-tbcbank", name: "TBC Bank", country: "GE", countryName: "Georgie", bic: "TBCBORGE", ibanFormat: "GE\\d{20}", ibanLength: 22 },
  { id: "ge-bog", name: "Bank of Georgia", country: "GE", countryName: "Georgie", bic: "BAGAGE22", ibanFormat: "GE\\d{20}", ibanLength: 22 },

  // KAZAKHSTAN
  { id: "kz-halyk", name: "Halyk Bank", country: "KZ", countryName: "Kazakhstan", bic: "HSBKKZKX", ibanFormat: "KZ\\d{18}", ibanLength: 20 },
  { id: "kz-kaspi", name: "Kaspi Bank", country: "KZ", countryName: "Kazakhstan", bic: "CABORZKZ", ibanFormat: "KZ\\d{18}", ibanLength: 20 },
  { id: "kz-sberbank", name: "Sberbank Kazakhstan", country: "KZ", countryName: "Kazakhstan", bic: "SABORKZ", ibanFormat: "KZ\\d{18}", ibanLength: 20 },

  // AZERBAIDJAN
  { id: "az-pasha", name: "PASHA Bank", country: "AZ", countryName: "Azerbaidjan", bic: "PASHAZ22", ibanFormat: "AZ\\d{26}", ibanLength: 28 },
  { id: "az-kapitalbank", name: "Kapital Bank", country: "AZ", countryName: "Azerbaidjan", bic: "AIIBAZ2X", ibanFormat: "AZ\\d{26}", ibanLength: 28 },

  // SERBIE
  { id: "rs-intesa", name: "Banca Intesa Serbia", country: "RS", countryName: "Serbie", bic: "DBDBRSBG", ibanFormat: "RS\\d{20}", ibanLength: 22 },
  { id: "rs-unicredit", name: "UniCredit Bank Serbia", country: "RS", countryName: "Serbie", bic: "BACXRSBG", ibanFormat: "RS\\d{20}", ibanLength: 22 },

  // BOSNIE-HERZEGOVINE
  { id: "ba-unicredit", name: "UniCredit Bank BiH", country: "BA", countryName: "Bosnie-Herzegovine", bic: "BLBABORBA", ibanFormat: "BA\\d{18}", ibanLength: 20 },
  { id: "ba-raiffeisen", name: "Raiffeisen Bank BiH", country: "BA", countryName: "Bosnie-Herzegovine", bic: "RABORZBABA", ibanFormat: "BA\\d{18}", ibanLength: 20 },

  // MONTENEGRO
  { id: "me-ckb", name: "Crnogorska komercijalna banka", country: "ME", countryName: "Montenegro", bic: "CKBCMEP1", ibanFormat: "ME\\d{20}", ibanLength: 22 },
  { id: "me-erste", name: "Erste Bank Montenegro", country: "ME", countryName: "Montenegro", bic: "ESBCMEPO", ibanFormat: "ME\\d{20}", ibanLength: 22 },

  // MACEDOINE DU NORD
  { id: "mk-komercijalna", name: "Komercijalna Banka", country: "MK", countryName: "Macedoine du Nord", bic: "KOBSMK2X", ibanFormat: "MK\\d{17}", ibanLength: 19 },
  { id: "mk-stopanska", name: "Stopanska Banka", country: "MK", countryName: "Macedoine du Nord", bic: "STOBMK2X", ibanFormat: "MK\\d{17}", ibanLength: 19 },

  // ALBANIE
  { id: "al-raiffeisen", name: "Raiffeisen Bank Albania", country: "AL", countryName: "Albanie", bic: "SGBAALTR", ibanFormat: "AL\\d{26}", ibanLength: 28 },
  { id: "al-bkt", name: "Banka Kombetare Tregtare", country: "AL", countryName: "Albanie", bic: "NCBAALTR", ibanFormat: "AL\\d{26}", ibanLength: 28 },

  // PANAMA
  { id: "pa-banistmo", name: "Banistmo", country: "PA", countryName: "Panama", bic: "ABNAPAPA", ibanFormat: "", ibanLength: 0 },
  { id: "pa-general", name: "Banco General", country: "PA", countryName: "Panama", bic: "BAGEPAPA", ibanFormat: "", ibanLength: 0 },
  { id: "pa-bladex", name: "Bladex", country: "PA", countryName: "Panama", bic: "LABOPAPA", ibanFormat: "", ibanLength: 0 },

  // REPUBLIQUE DOMINICAINE
  { id: "do-banreservas", name: "Banreservas", country: "DO", countryName: "Republique Dominicaine", bic: "BRESDOSD", ibanFormat: "", ibanLength: 0 },
  { id: "do-popular", name: "Banco Popular Dominicano", country: "DO", countryName: "Republique Dominicaine", bic: "BPDODOSD", ibanFormat: "", ibanLength: 0 },
  { id: "do-bhd", name: "Banco BHD Leon", country: "DO", countryName: "Republique Dominicaine", bic: "BHDLDOSD", ibanFormat: "", ibanLength: 0 },

  // JAMAIQUE
  { id: "jm-ncb", name: "National Commercial Bank Jamaica", country: "JM", countryName: "Jamaique", bic: "JNCBJMKX", ibanFormat: "", ibanLength: 0 },
  { id: "jm-scotiabank", name: "Scotiabank Jamaica", country: "JM", countryName: "Jamaique", bic: "NABORJMK", ibanFormat: "", ibanLength: 0 },

  // BAHAMAS
  { id: "bs-commonweatlh", name: "Commonwealth Bank", country: "BS", countryName: "Bahamas", bic: "COMBBS22", ibanFormat: "", ibanLength: 0 },
  { id: "bs-firstcaribbean", name: "FirstCaribbean Bank", country: "BS", countryName: "Bahamas", bic: "FABORBS", ibanFormat: "", ibanLength: 0 },

  // TRINITE-ET-TOBAGO
  { id: "tt-firstcitizens", name: "First Citizens Bank", country: "TT", countryName: "Trinite-et-Tobago", bic: "FTCUTT21", ibanFormat: "", ibanLength: 0 },
  { id: "tt-republic", name: "Republic Bank", country: "TT", countryName: "Trinite-et-Tobago", bic: "RABORTT", ibanFormat: "", ibanLength: 0 },

  // ILE MAURICE
  { id: "mu-mcb", name: "Mauritius Commercial Bank", country: "MU", countryName: "Ile Maurice", bic: "MCBLMUMU", ibanFormat: "MU\\d{28}", ibanLength: 30 },
  { id: "mu-sbm", name: "SBM Bank", country: "MU", countryName: "Ile Maurice", bic: "STCHMUMU", ibanFormat: "MU\\d{28}", ibanLength: 30 },

  // NOUVELLE-CALEDONIE (Territoire FR)
  { id: "nc-bnc", name: "Banque de Nouvelle-Caledonie", country: "NC", countryName: "Nouvelle-Caledonie", bic: "SGBNNCNO", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "nc-bci", name: "BCI Nouvelle-Caledonie", country: "NC", countryName: "Nouvelle-Caledonie", bic: "BCITNC1N", ibanFormat: "FR\\d{25}", ibanLength: 27 },

  // POLYNESIE FRANCAISE (Territoire FR)
  { id: "pf-socredo", name: "Banque Socredo", country: "PF", countryName: "Polynesie francaise", bic: "SGBTPFPF", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "pf-otcpf", name: "OPT Polynesie", country: "PF", countryName: "Polynesie francaise", bic: "CEPPFR21", ibanFormat: "FR\\d{25}", ibanLength: 27 },

  // MARTINIQUE / GUADELOUPE / REUNION (Departements FR)
  { id: "gp-bdaf", name: "BDAF Guadeloupe", country: "GP", countryName: "Guadeloupe", bic: "BDAFFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "mq-bdaf", name: "BDAF Martinique", country: "MQ", countryName: "Martinique", bic: "BDAFFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
  { id: "re-bred", name: "BRED La Reunion", country: "RE", countryName: "La Reunion", bic: "BREDFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },

  // GUYANE FRANCAISE (Departement FR)
  { id: "gf-bred", name: "BRED Guyane", country: "GF", countryName: "Guyane francaise", bic: "BREDFRPP", ibanFormat: "FR\\d{25}", ibanLength: 27 },
];

// Fonction de recherche intelligente
export function searchBanks(query: string, maxResults: number = 8): Bank[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Normalisation : enlever les accents et mettre en minuscules
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return BANKS.filter((bank) => {
    const normalizedName = bank.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const normalizedCountry = bank.country.toLowerCase();
    const normalizedCountryName = bank.countryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedCountry.includes(normalizedQuery) ||
      normalizedCountryName.includes(normalizedQuery) ||
      bank.bic.toLowerCase().includes(normalizedQuery)
    );
  }).slice(0, maxResults);
}

// Validation IBAN selon le pays
export function validateIban(iban: string, bank: Bank): boolean {
  if (!bank.ibanFormat || bank.ibanFormat === "") {
    // Pour les pays sans IBAN (USA, Canada, etc.), on ne valide pas
    return true;
  }

  const cleanIban = iban.replace(/\s+/g, "").toUpperCase();
  const regex = new RegExp("^" + bank.ibanFormat + "$");
  return regex.test(cleanIban);
}

// Formatage IBAN avec espaces tous les 4 caractères
export function formatIban(iban: string): string {
  const cleanIban = iban.replace(/\s+/g, "").toUpperCase();
  return cleanIban.replace(/(.{4})/g, "$1 ").trim();
}

// Obtenir une banque par son ID
export function getBankById(id: string): Bank | undefined {
  return BANKS.find((bank) => bank.id === id);
}

// Obtenir une banque par son BIC
export function getBankByBic(bic: string): Bank | undefined {
  return BANKS.find((bank) => bank.bic === bic.toUpperCase());
}
