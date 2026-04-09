import * as fs from 'fs';
import * as path from 'path';

// Traductions admin et settings pour chaque langue manquante
const translations = {
  es: {
    admin: `      admin: {
        title: 'Configuración 2FA Administrador',
        subtitle: 'Seguridad recomendada para todos los administradores',
        alertTitle: 'Atención',
        alertMessage: 'La autenticación de dos factores (2FA) es muy recomendada para todas las cuentas de administrador para proteger datos sensibles.',
        step1Title: 'Descargue Google Authenticator',
        step1Description: 'Instale la aplicación Google Authenticator en su smartphone:',
        androidLink: 'Android (Play Store)',
        iosLink: 'iOS (App Store)',
        step2Title: 'Escanee el código QR',
        step3Title: 'Ingrese el código generado',
        backupCodeLabel: 'Código de respaldo (si el QR no funciona):',
        verificationCodeLabel: 'Código de verificación (6 dígitos)',
        activating: 'Activando...',
        activateAndLogin: 'Activar 2FA e iniciar sesión',
        errorConfigTitle: 'Configuración imposible',
        errorConfigMessage: 'Error al configurar 2FA. El 2FA puede estar ya configurado para esta cuenta.',
        solutionsTitle: 'Soluciones posibles:',
        solution1: 'Use su aplicación de autenticación existente (Google Authenticator, Authy, etc.)',
        solution2: 'Si ha perdido el acceso, inicie sesión con su código 2FA actual y reconfigure en ajustes',
        solution3: 'Como último recurso, contacte a un super-administrador para restablecer su 2FA',
        sessionExpired: 'Sesión expirada. Por favor inicie sesión nuevamente.',
        alreadyConfigured: '2FA ya configurado',
        configSuccessTitle: 'Éxito',
        configSuccessMessage: '2FA configurado exitosamente. Iniciando sesión...',
        invalidCodeTitle: 'Error',
        invalidCodeMessage: 'Código inválido. Por favor intente de nuevo.',
      },
      settings: {
        enabled: 'Autenticación de dos factores activada',
        enabledMessage: 'Su cuenta ahora está protegida por autenticación de dos factores',
        disabled: 'Autenticación de dos factores desactivada',
        disabledMessage: 'La autenticación de dos factores ha sido desactivada para su cuenta',
        invalidCode: 'Código de verificación inválido',
      },`,
    
    pt: `      admin: {
        title: 'Configuração 2FA Administrador',
        subtitle: 'Segurança recomendada para todos os administradores',
        alertTitle: 'Atenção',
        alertMessage: 'A autenticação de dois fatores (2FA) é fortemente recomendada para todas as contas de administrador para proteger dados sensíveis.',
        step1Title: 'Baixe o Google Authenticator',
        step1Description: 'Instale o aplicativo Google Authenticator em seu smartphone:',
        androidLink: 'Android (Play Store)',
        iosLink: 'iOS (App Store)',
        step2Title: 'Escaneie o código QR',
        step3Title: 'Digite o código gerado',
        backupCodeLabel: 'Código de backup (se o QR não funcionar):',
        verificationCodeLabel: 'Código de verificação (6 dígitos)',
        activating: 'Ativando...',
        activateAndLogin: 'Ativar 2FA e fazer login',
        errorConfigTitle: 'Configuração impossível',
        errorConfigMessage: 'Erro ao configurar 2FA. O 2FA pode já estar configurado para esta conta.',
        solutionsTitle: 'Soluções possíveis:',
        solution1: 'Use seu aplicativo de autenticação existente (Google Authenticator, Authy, etc.)',
        solution2: 'Se perdeu o acesso, faça login com seu código 2FA atual e reconfigure nas configurações',
        solution3: 'Como último recurso, entre em contato com um super-administrador para redefinir seu 2FA',
        sessionExpired: 'Sessão expirada. Por favor, faça login novamente.',
        alreadyConfigured: '2FA já configurado',
        configSuccessTitle: 'Sucesso',
        configSuccessMessage: '2FA configurado com sucesso. Fazendo login...',
        invalidCodeTitle: 'Erro',
        invalidCodeMessage: 'Código inválido. Por favor, tente novamente.',
      },
      settings: {
        enabled: 'Autenticação de dois fatores ativada',
        enabledMessage: 'Sua conta agora está protegida por autenticação de dois fatores',
        disabled: 'Autenticação de dois fatores desativada',
        disabledMessage: 'A autenticação de dois fatores foi desativada para sua conta',
        invalidCode: 'Código de verificação inválido',
      },`,
    
    it: `      admin: {
        title: 'Configurazione 2FA Amministratore',
        subtitle: 'Sicurezza consigliata per tutti gli amministratori',
        alertTitle: 'Attenzione',
        alertMessage: 'L\'autenticazione a due fattori (2FA) è fortemente raccomandata per tutti gli account amministratore per proteggere i dati sensibili.',
        step1Title: 'Scarica Google Authenticator',
        step1Description: 'Installa l\'app Google Authenticator sul tuo smartphone:',
        androidLink: 'Android (Play Store)',
        iosLink: 'iOS (App Store)',
        step2Title: 'Scansiona il codice QR',
        step3Title: 'Inserisci il codice generato',
        backupCodeLabel: 'Codice di backup (se il QR non funziona):',
        verificationCodeLabel: 'Codice di verifica (6 cifre)',
        activating: 'Attivazione in corso...',
        activateAndLogin: 'Attiva 2FA e accedi',
        errorConfigTitle: 'Configurazione impossibile',
        errorConfigMessage: 'Errore durante la configurazione 2FA. Il 2FA potrebbe essere già configurato per questo account.',
        solutionsTitle: 'Soluzioni possibili:',
        solution1: 'Usa la tua app di autenticazione esistente (Google Authenticator, Authy, ecc.)',
        solution2: 'Se hai perso l\'accesso, accedi con il tuo codice 2FA attuale e riconfigura nelle impostazioni',
        solution3: 'Come ultima risorsa, contatta un super-amministratore per reimpostare il tuo 2FA',
        sessionExpired: 'Sessione scaduta. Si prega di accedere nuovamente.',
        alreadyConfigured: '2FA già configurato',
        configSuccessTitle: 'Successo',
        configSuccessMessage: '2FA configurato con successo. Accesso in corso...',
        invalidCodeTitle: 'Errore',
        invalidCodeMessage: 'Codice non valido. Riprova.',
      },
      settings: {
        enabled: 'Autenticazione a due fattori attivata',
        enabledMessage: 'Il tuo account è ora protetto dall\'autenticazione a due fattori',
        disabled: 'Autenticazione a due fattori disattivata',
        disabledMessage: 'L\'autenticazione a due fattori è stata disattivata per il tuo account',
        invalidCode: 'Codice di verifica non valido',
      },`,
    
    de: `      admin: {
        title: 'Administrator 2FA-Konfiguration',
        subtitle: 'Empfohlene Sicherheit für alle Administratoren',
        alertTitle: 'Achtung',
        alertMessage: 'Die Zwei-Faktor-Authentifizierung (2FA) wird für alle Administrator-Konten dringend empfohlen, um sensible Daten zu schützen.',
        step1Title: 'Google Authenticator herunterladen',
        step1Description: 'Installieren Sie die Google Authenticator-App auf Ihrem Smartphone:',
        androidLink: 'Android (Play Store)',
        iosLink: 'iOS (App Store)',
        step2Title: 'QR-Code scannen',
        step3Title: 'Generierten Code eingeben',
        backupCodeLabel: 'Backup-Code (falls QR nicht funktioniert):',
        verificationCodeLabel: 'Bestätigungscode (6 Ziffern)',
        activating: 'Wird aktiviert...',
        activateAndLogin: '2FA aktivieren und anmelden',
        errorConfigTitle: 'Konfiguration unmöglich',
        errorConfigMessage: 'Fehler beim Konfigurieren von 2FA. 2FA ist möglicherweise bereits für dieses Konto konfiguriert.',
        solutionsTitle: 'Mögliche Lösungen:',
        solution1: 'Verwenden Sie Ihre vorhandene Authentifikator-App (Google Authenticator, Authy, etc.)',
        solution2: 'Wenn Sie den Zugriff verloren haben, melden Sie sich mit Ihrem aktuellen 2FA-Code an und konfigurieren Sie ihn in den Einstellungen neu',
        solution3: 'Als letzten Ausweg kontaktieren Sie einen Super-Administrator, um Ihr 2FA zurückzusetzen',
        sessionExpired: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.',
        alreadyConfigured: '2FA bereits konfiguriert',
        configSuccessTitle: 'Erfolg',
        configSuccessMessage: '2FA erfolgreich konfiguriert. Anmeldung läuft...',
        invalidCodeTitle: 'Fehler',
        invalidCodeMessage: 'Ungültiger Code. Bitte versuchen Sie es erneut.',
      },
      settings: {
        enabled: 'Zwei-Faktor-Authentifizierung aktiviert',
        enabledMessage: 'Ihr Konto ist jetzt durch Zwei-Faktor-Authentifizierung geschützt',
        disabled: 'Zwei-Faktor-Authentifizierung deaktiviert',
        disabledMessage: 'Die Zwei-Faktor-Authentifizierung wurde für Ihr Konto deaktiviert',
        invalidCode: 'Ungültiger Bestätigungscode',
      },`,
    
    nl: `      admin: {
        title: 'Administrator 2FA Configuratie',
        subtitle: 'Aanbevolen beveiliging voor alle beheerders',
        alertTitle: 'Let op',
        alertMessage: 'Tweefactorauthenticatie (2FA) wordt sterk aanbevolen voor alle beheerdersaccounts om gevoelige gegevens te beschermen.',
        step1Title: 'Download Google Authenticator',
        step1Description: 'Installeer de Google Authenticator-app op uw smartphone:',
        androidLink: 'Android (Play Store)',
        iosLink: 'iOS (App Store)',
        step2Title: 'Scan de QR-code',
        step3Title: 'Voer de gegenereerde code in',
        backupCodeLabel: 'Back-upcode (als QR niet werkt):',
        verificationCodeLabel: 'Verificatiecode (6 cijfers)',
        activating: 'Activeren...',
        activateAndLogin: 'Activeer 2FA en log in',
        errorConfigTitle: 'Configuratie onmogelijk',
        errorConfigMessage: 'Fout bij het configureren van 2FA. 2FA is mogelijk al geconfigureerd voor dit account.',
        solutionsTitle: 'Mogelijke oplossingen:',
        solution1: 'Gebruik uw bestaande authenticator-app (Google Authenticator, Authy, etc.)',
        solution2: 'Als u de toegang bent kwijtgeraakt, log dan in met uw huidige 2FA-code en herconfigureer in instellingen',
        solution3: 'Als laatste redmiddel, neem contact op met een super-beheerder om uw 2FA te resetten',
        sessionExpired: 'Sessie verlopen. Log opnieuw in.',
        alreadyConfigured: '2FA al geconfigureerd',
        configSuccessTitle: 'Succes',
        configSuccessMessage: '2FA succesvol geconfigureerd. Inloggen...',
        invalidCodeTitle: 'Fout',
        invalidCodeMessage: 'Ongeldige code. Probeer opnieuw.',
      },
      settings: {
        enabled: 'Tweefactorauthenticatie geactiveerd',
        enabledMessage: 'Uw account is nu beschermd door tweefactorauthenticatie',
        disabled: 'Tweefactorauthenticatie uitgeschakeld',
        disabledMessage: 'Tweefactorauthenticatie is uitgeschakeld voor uw account',
        invalidCode: 'Ongeldige verificatiecode',
      },`,
  }
};

// Mapping des langues aux patterns de recherche
const languagePatterns = {
  es: {
    searchPattern: "errorMessage: 'Código inválido. Por favor intente de nuevo.',\n      },\n    },",
    replacementPattern: "errorMessage: 'Código inválido. Por favor intente de nuevo.',\n      },",
  },
  pt: {
    searchPattern: "errorMessage: 'O código que você digitou é inválido. Tente novamente.',\n      },\n    },",
    replacementPattern: "errorMessage: 'O código que você digitou é inválido. Tente novamente.',\n      },",
  },
  it: {
    searchPattern: "errorMessage: 'Il codice inserito non è valido o è scaduto. Riprova.',\n      },\n    },",
    replacementPattern: "errorMessage: 'Il codice inserito non è valido o è scaduto. Riprova.',\n      },",
  },
  de: {
    searchPattern: "errorMessage: 'Der eingegebene Code ist ungültig oder abgelaufen. Versuchen Sie es erneut.',\n      },\n    },",
    replacementPattern: "errorMessage: 'Der eingegebene Code ist ungültig oder abgelaufen. Versuchen Sie es erneut.',\n      },",
  },
  nl: {
    searchPattern: "errorMessage: 'De ingevoerde code is ongeldig of verlopen. Probeer opnieuw.',\n      },\n    },",
    replacementPattern: "errorMessage: 'De ingevoerde code is ongeldig of verlopen. Probeer opnieuw.',\n      },",
  },
};

async function addMissingTranslations() {
  const filePath = path.join(process.cwd(), 'client/src/lib/i18n.ts');
  
  console.log('📖 Lecture du fichier i18n.ts...');
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Pour chaque langue, ajouter les traductions manquantes
  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    console.log(`🔍 Traitement de ${lang.toUpperCase()}...`);
    
    const { searchPattern, replacementPattern } = pattern;
    const newContent = replacementPattern + '\n' + translations.es[lang as keyof typeof translations.es];
    
    if (content.includes(searchPattern)) {
      content = content.replace(searchPattern, newContent + '\n    },');
      console.log(`✅ Traductions ajoutées pour ${lang.toUpperCase()}`);
    } else {
      console.log(`⚠️  Pattern non trouvé pour ${lang.toUpperCase()}, recherche alternative...`);
    }
  }
  
  console.log('💾 Écriture du fichier modifié...');
  fs.writeFileSync(filePath, content, 'utf-8');
  
  console.log('✨ Traductions ajoutées avec succès!');
}

addMissingTranslations().catch(console.error);
