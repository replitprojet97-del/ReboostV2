function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getEmailBaseUrl(): string {
  // Always use the production URL for email assets to ensure they are accessible
  return 'https://kreditpass.org';
}

interface EmailHeaderOptions {
  title?: string;
  subtitle?: string;
  gradientColors?: string;
  showLogo?: boolean;
}

function getEmailHeader(options: EmailHeaderOptions = {}): string {
  const {
    title = '',
    subtitle = '',
    gradientColors = 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #c9a227 100%)',
    showLogo = true
  } = options;
  
  const logoTextHtml = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #1e3a8a;
    ">
      KreditPass
      <span style="color:#0f172a;">GROUP</span>
    </div>
    <div style="
      margin-top: 6px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    ">
      Financing Solutions
    </div>
  `;
  
  return `
    <tr>
      <td align="center" style="background: ${gradientColors}; padding: 30px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${showLogo ? `
          <tr>
            <td align="center" style="padding-bottom: 15px;">
              <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; display: inline-block;">
                ${logoTextHtml}
              </div>
            </td>
          </tr>
          ` : ''}
          ${title ? `
          <tr>
            <td align="center">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">${title}</h1>
            </td>
          </tr>
          ` : ''}
          ${subtitle ? `
          <tr>
            <td align="center" style="padding-top: 8px;">
              <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9); font-family: Arial, sans-serif;">${subtitle}</p>
            </td>
          </tr>
          ` : ''}
        </table>
      </td>
    </tr>
  `;
}

function getEmailFooter(footerText: string): string {
  const currentYear = new Date().getFullYear();
  
  const logoTextHtml = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #1e3a8a;
      opacity: 0.8;
    ">
      KreditPass
      <span style="color:#0f172a;">GROUP</span>
    </div>
  `;
  
  return `
    <tr>
      <td align="center" style="background-color: #f8fafc; padding: 30px 20px; border-top: 1px solid #e2e8f0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding-bottom: 15px;">
              ${logoTextHtml}
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-family: Arial, sans-serif;">
                &copy; ${currentYear} KreditPass. ${footerText}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function getEmailWrapper(content: string, language: string = 'fr'): string {
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>KreditPass</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-padding {
        padding: 20px 15px !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      .mobile-full-width {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export type Language = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl';
type TemplateType = 'verification' | 'welcome' | 'contract' | 'fundingRelease' | 'otp' | 'resetPassword' | 
  'loanRequestUser' | 'loanRequestAdmin' | 'kycUploadedAdmin' | 'loanApprovedUser' | 
  'transferInitiatedAdmin' | 'transferCodeUser' | 'transferCompletedUser' | 'transferCompletedAdmin' | 'transferCodesAdmin';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface VerificationVariables {
  fullName: string;
  verificationUrl: string;
  accountTypeText: string;
}

interface WelcomeVariables {
  fullName: string;
  accountTypeText: string;
  loginUrl: string;
}

interface ContractVariables {
  fullName: string;
  amount: string;
  loanId: string;
  dashboardUrl: string;
  fromEmail: string;
}

interface FundingReleaseVariables {
  fullName: string;
  amount: string;
  loanId: string;
}

interface OtpVariables {
  fullName: string;
  otpCode: string;
}

interface ResetPasswordVariables {
  fullName: string;
  resetUrl: string;
}

interface LoanRequestUserVariables {
  fullName: string;
  amount: string;
  loanType: string;
  reference: string;
  dashboardUrl: string;
}

interface DocumentInfo {
  documentType: string;
  fileUrl: string;
  fileName: string;
}

interface LoanRequestAdminVariables {
  fullName: string;
  email: string;
  phone: string | null;
  accountType: string;
  amount: string;
  duration: number;
  loanType: string;
  reference: string;
  userId: string;
  reviewUrl: string;
  documents: DocumentInfo[];
}

interface KycUploadedAdminVariables {
  fullName: string;
  email: string;
  documentType: string;
  loanType: string;
  userId: string;
  reviewUrl: string;
}

interface LoanApprovedUserVariables {
  fullName: string;
  amount: string;
  loanType: string;
  reference: string;
  loginUrl: string;
}

interface TransferInitiatedAdminVariables {
  fullName: string;
  email: string;
  amount: string;
  recipient: string;
  transferId: string;
  userId: string;
  reviewUrl: string;
}

interface TransferCodeUserVariables {
  fullName: string;
  amount: string;
  recipient: string;
  code: string;
  codeSequence: string;
  totalCodes: string;
}

interface TransferCompletedUserVariables {
  fullName: string;
  amount: string;
  recipient: string;
  recipientIban: string;
  transferId: string;
  supportEmail: string;
}

interface TransferCompletedAdminVariables {
  fullName: string;
  email: string;
  amount: string;
  recipient: string;
  recipientIban: string;
  transferId: string;
  userId: string;
  completedAt: string;
  totalValidations: string;
  reviewUrl: string;
}

interface TransferCodesAdminVariables {
  fullName: string;
  amount: string;
  loanId: string;
  codes: Array<{ sequence: number; code: string; pausePercent: number; context: string }>;
}

type TemplateVariables = VerificationVariables | WelcomeVariables | ContractVariables | FundingReleaseVariables | OtpVariables | ResetPasswordVariables |
  LoanRequestUserVariables | LoanRequestAdminVariables | KycUploadedAdminVariables | LoanApprovedUserVariables | 
  TransferInitiatedAdminVariables | TransferCodeUserVariables | TransferCompletedUserVariables | TransferCompletedAdminVariables | TransferCodesAdminVariables;

const translations = {
  fr: {
    accountTypes: {
      personal: "particulier",
      business: "professionnel/entreprise"
    },
    verification: {
      subject: "Vérifiez votre adresse email - KreditPass",
      tagline: "Solutions de financement",
      greeting: "Bonjour",
      thankYou: "Merci de vous être inscrit sur KreditPass en tant que",
      instruction: "Pour activer votre compte et accéder à nos services de financement, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :",
      buttonText: "Vérifier mon email",
      alternativeText: "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
      disclaimerText: "Si vous n'avez pas créé de compte sur KreditPass, vous pouvez ignorer cet email.",
      footer: "Tous droits réservés.",
      textVersion: {
        thankYou: "Merci de vous être inscrit sur KreditPass en tant que",
        instruction: "Pour activer votre compte, veuillez vérifier votre adresse email en visitant ce lien :",
        disclaimer: "Si vous n'avez pas créé de compte sur KreditPass, vous pouvez ignorer cet email.",
        signature: "KreditPass - Solutions de financement"
      }
    },
    welcome: {
      subject: "Bienvenue sur KreditPass !",
      headerTitle: "🎉 Bienvenue sur KreditPass !",
      greeting: "Bonjour",
      verifiedMessage: "Votre email a été vérifié avec succès ! Votre compte",
      activeMessage: "est maintenant actif.",
      featuresIntro: "Vous pouvez dès à présent accéder à toutes nos fonctionnalités :",
      features: [
        "Demander un prêt personnel ou professionnel",
        "Gérer vos remboursements",
        "Effectuer des transferts",
        "Consulter votre tableau de bord"
      ],
      buttonText: "Se connecter",
      supportText: "Notre équipe est à votre disposition pour toute question.",
      footer: "Tous droits réservés."
    },
    contract: {
      subject: "Votre contrat de prêt est disponible - KreditPass",
      headerTitle: "🎉 Félicitations !",
      headerSubtitle: "Votre prêt est approuvé",
      greeting: "Bonjour",
      approvedMessage: "Excellente nouvelle ! Votre demande de prêt de",
      approvedMessage2: "a été approuvée.",
      contractReadyTitle: "📄 Votre contrat de prêt est prêt",
      referenceLabel: "Référence:",
      nextStepsTitle: "Prochaines étapes :",
      step1Title: "Télécharger le contrat",
      step1Text: "Téléchargez et lisez attentivement votre contrat de prêt",
      step2Title: "Signer le document",
      step2Text: "Imprimez, signez avec la mention \"Lu et approuvé\" suivie de votre signature",
      step3Title: "Retourner le contrat signé",
      step3Text: "Téléchargez le document signé depuis votre espace client et cliquer sur envoyer.",
      downloadButton: "📥 Télécharger le contrat",
      importantTitle: "⚠️ Important :",
      importantMessage: "Les fonds seront débloqués dans un délai allant de quelques minutes à 24 heures maximum.",
      accessNote: "Vous pouvez également accéder à votre contrat depuis votre espace client à tout moment.",
      contactText: "Des questions ? Contactez-nous à support@kreditpass.org",
      footer: "Tous droits réservés."
    },
    fundingRelease: {
      subject: "Vos fonds ont été débloqués - KreditPass",
      headerTitle: "✅ Fonds débloqués",
      headerSubtitle: "Votre argent est disponible",
      greeting: "Bonjour",
      releaseMessage: "Excellente nouvelle ! Les fonds de votre prêt de",
      releaseMessage2: "ont été débloqués avec succès.",
      referenceLabel: "Référence du prêt:",
      availabilityTitle: "💳 Disponibilité des fonds",
      availabilityText: "Les fonds sont maintenant disponibles sur votre compte et peuvent être utilisés immédiatement.",
      nextStepsTitle: "Que faire maintenant :",
      step1: "Consultez votre solde dans votre tableau de bord",
      step2: "Effectuez un transfert vers votre compte bancaire",
      step3: "Gérez vos échéances de remboursement",
      dashboardButton: "Accéder au tableau de bord",
      reminderTitle: "📅 Rappel important",
      reminderText: "N'oubliez pas vos échéances de remboursement. Vous pouvez consulter le calendrier complet dans votre espace client.",
      supportText: "Notre équipe reste à votre disposition pour toute question.",
      contactText: "Des questions ? Contactez-nous à",
      footer: "Tous droits réservés."
    },
    otp: {
      subject: "Code de vérification - KreditPass",
      headerTitle: "🔐 Authentification à deux facteurs",
      greeting: "Bonjour",
      codeTitle: "Votre code de vérification",
      instruction: "Utilisez le code ci-dessous pour vous connecter à votre compte KreditPass :",
      expirationText: "Ce code expirera dans 5 minutes.",
      securityWarning: "⚠️ Pour votre sécurité, ne partagez jamais ce code avec quiconque. Notre équipe ne vous demandera jamais ce code.",
      notYouText: "Si vous n'avez pas demandé ce code, ignorez cet email et votre compte restera sécurisé.",
      footer: "Tous droits réservés."
    },
    loanRequestUser: {
      subject: "Votre demande de prêt a été reçue - KreditPass",
      headerTitle: "✅ Demande de prêt reçue",
      greeting: "Bonjour",
      confirmationMessage: "Nous avons bien reçu votre demande de prêt",
      confirmationMessage2: "pour un montant de",
      referenceLabel: "Référence de la demande:",
      nextStepsTitle: "Prochaines étapes :",
      step1: "Notre équipe examine votre dossier",
      step2: "Vous recevrez une réponse dans les 24-48 heures",
      step3: "Si des documents supplémentaires sont nécessaires, nous vous contacterons",
      dashboardText: "Vous pouvez suivre l'état de votre demande depuis votre tableau de bord.",
      dashboardButton: "Accéder à mon tableau de bord",
      supportText: "Notre équipe reste à votre disposition pour toute question.",
      footer: "Tous droits réservés."
    },
    loanRequestAdmin: {
      subject: "Nouvelle demande de prêt - KreditPass",
      headerTitle: "📋 Nouvelle demande de prêt",
      message: "Une nouvelle demande de prêt a été soumise et nécessite votre attention.",
      applicantLabel: "Demandeur:",
      emailLabel: "Email:",
      phoneLabel: "Téléphone:",
      accountTypeLabel: "Type de compte:",
      amountLabel: "Montant demandé:",
      durationLabel: "Durée:",
      loanTypeLabel: "Type de prêt:",
      referenceLabel: "Référence:",
      userIdLabel: "ID utilisateur:",
      documentsTitle: "📄 Documents uploadés",
      documentTypeLabel: "Type de document",
      downloadLabel: "Télécharger",
      noDocuments: "Aucun document uploadé",
      monthsLabel: "mois",
      actionButton: "Examiner la demande",
      footer: "Tous droits réservés."
    },
    kycUploadedAdmin: {
      subject: "Nouveau document KYC uploadé - KreditPass",
      headerTitle: "📄 Nouveau document KYC",
      message: "Un nouveau document KYC a été uploadé et nécessite votre vérification.",
      userLabel: "Utilisateur:",
      emailLabel: "Email:",
      documentTypeLabel: "Type de document:",
      loanTypeLabel: "Type de prêt:",
      userIdLabel: "ID utilisateur:",
      actionButton: "Vérifier le document",
      footer: "Tous droits réservés."
    },
    loanApprovedUser: {
      subject: "Félicitations ! Votre prêt est approuvé - KreditPass",
      headerTitle: "🎉 Félicitations !",
      headerSubtitle: "Votre prêt est approuvé",
      greeting: "Bonjour",
      approvalMessage: "Excellente nouvelle ! Votre demande de prêt de",
      approvalMessage2: "a été approuvée.",
      referenceLabel: "Référence:",
      nextStepsTitle: "Prochaines étapes :",
      step1: "Téléchargez votre contrat de prêt depuis votre espace client",
      step2: "Signez le contrat et retournez-le nous",
      step3: "Les fonds seront débloqués sous 24 heures après réception du contrat signé",
      loginButton: "Accéder à mon espace client",
      importantTitle: "⚠️ Important :",
      importantMessage: "Vous devez signer et retourner le contrat pour que les fonds soient débloqués.",
      supportText: "Notre équipe reste à votre disposition pour toute question.",
      footer: "Tous droits réservés."
    },
    transferInitiatedAdmin: {
      subject: "Nouveau transfert initié - KreditPass",
      headerTitle: "💸 Nouveau transfert initié",
      message: "Un nouveau transfert a été initié et nécessite votre attention.",
      userLabel: "Utilisateur:",
      emailLabel: "Email:",
      amountLabel: "Montant:",
      recipientLabel: "Bénéficiaire:",
      transferIdLabel: "ID transfert:",
      userIdLabel: "ID utilisateur:",
      actionButton: "Voir le transfert",
      footer: "Tous droits réservés."
    },
    transferCodeUser: {
      subject: "Code de validation pour votre transfert - KreditPass",
      headerTitle: "🔐 Code de validation",
      greeting: "Bonjour",
      transferInfoTitle: "Détails du transfert",
      amountLabel: "Montant:",
      recipientLabel: "Bénéficiaire:",
      codeTitle: "Votre code de validation",
      codeSequence: "Code",
      codeOf: "sur",
      instruction: "Utilisez le code ci-dessous pour valider votre transfert :",
      expirationText: "Ce code expirera dans 15 minutes.",
      securityWarning: "⚠️ Pour votre sécurité, ne partagez jamais ce code avec quiconque. Notre équipe ne vous demandera jamais ce code.",
      notYouText: "Si vous n'avez pas initié ce transfert, contactez-nous immédiatement.",
      footer: "Tous droits réservés."
    },
    transferCompletedUser: {
      subject: "Votre transfert est terminé - KreditPass",
      headerTitle: "✅ Transfert terminé avec succès",
      greeting: "Bonjour",
      congratulationsMessage: "Votre transfert a été complété avec succès après validation de tous les codes de sécurité.",
      summaryTitle: "📋 Récapitulatif du transfert",
      amountLabel: "Montant transféré:",
      recipientLabel: "Bénéficiaire:",
      ibanLabel: "IBAN du bénéficiaire:",
      referenceLabel: "Référence du transfert:",
      availabilityTitle: "⏱️ Disponibilité des fonds",
      availabilityMessage: "Les fonds seront disponibles sur le compte du bénéficiaire dans un délai de 24 à 72 heures ouvrées, selon les délais bancaires.",
      supportTitle: "💬 Besoin d'aide ?",
      supportMessage: "Si vous rencontrez le moindre problème ou avez des questions concernant ce transfert, notre équipe est à votre disposition:",
      supportEmail: "Contactez-nous à:",
      thanksMessage: "Merci de votre confiance.",
      footer: "Tous droits réservés."
    },
    transferCodesAdmin: {
      subject: "Codes de transfert générés - KreditPass",
      headerTitle: "🔐 Codes de validation de transfert générés",
      message: "Les codes de transfert ont été générés automatiquement pour le prêt suivant:",
      userLabel: "Utilisateur:",
      amountLabel: "Montant du prêt:",
      loanIdLabel: "Référence du prêt:",
      codesTitle: "📋 Liste des codes de validation",
      codeInstruction: "Transmettez ces codes manuellement à l'utilisateur au moment approprié. Le transfert se mettra automatiquement en pause aux pourcentages indiqués.",
      sequenceLabel: "Code",
      pauseLabel: "Pause à",
      contextLabel: "Type",
      importantTitle: "⚠️ Important:",
      importantMessage: "Ces codes sont confidentiels et ne doivent JAMAIS être envoyés automatiquement. Vous devez les transmettre manuellement à l'utilisateur un par un, au fur et à mesure de la progression du transfert.",
      footer: "Tous droits réservés."
    },
    transferCompletedAdmin: {
      subject: "Rapport de transfert complété - KreditPass",
      headerTitle: "📊 Transfert complété - Rapport administrateur",
      message: "Un transfert a été complété avec succès. Voici le rapport détaillé:",
      userInfoTitle: "👤 Informations utilisateur",
      userLabel: "Utilisateur:",
      emailLabel: "Email:",
      userIdLabel: "ID utilisateur:",
      transferInfoTitle: "💸 Détails du transfert",
      amountLabel: "Montant:",
      recipientLabel: "Bénéficiaire:",
      ibanLabel: "IBAN:",
      transferIdLabel: "ID transfert:",
      progressTitle: "✅ Progression et validation",
      validationsLabel: "Codes validés:",
      completedAtLabel: "Complété le:",
      actionButton: "Voir les détails complets",
      footer: "Tous droits réservés."
    }
  },
  en: {
    accountTypes: {
      personal: "individual/personal",
      business: "business/professional"
    },
    verification: {
      subject: "Verify your email address - KreditPass",
      tagline: "Financing Solutions",
      greeting: "Hello",
      thankYou: "Thank you for signing up on KreditPass as a",
      instruction: "To activate your account and access our financing services, please verify your email address by clicking the button below:",
      buttonText: "Verify my email",
      alternativeText: "If the button doesn't work, copy and paste this link into your browser:",
      disclaimerText: "If you didn't create an account on KreditPass, you can ignore this email.",
      footer: "All rights reserved.",
      textVersion: {
        thankYou: "Thank you for signing up on KreditPass as a",
        instruction: "To activate your account, please verify your email address by visiting this link:",
        disclaimer: "If you didn't create an account on KreditPass, you can ignore this email.",
        signature: "KreditPass - Financing Solutions"
      }
    },
    welcome: {
      subject: "Welcome to KreditPass!",
      headerTitle: "🎉 Welcome to KreditPass!",
      greeting: "Hello",
      verifiedMessage: "Your email has been successfully verified! Your",
      activeMessage: "account is now active.",
      featuresIntro: "You can now access all our features:",
      features: [
        "Request a personal or business loan",
        "Manage your repayments",
        "Make transfers",
        "Access your dashboard"
      ],
      buttonText: "Log in",
      supportText: "Our team is available for any questions.",
      footer: "All rights reserved."
    },
    contract: {
      subject: "Your loan contract is available - KreditPass",
      headerTitle: "🎉 Congratulations!",
      headerSubtitle: "Your loan is approved",
      greeting: "Hello",
      approvedMessage: "Great news! Your loan request for",
      approvedMessage2: "has been approved.",
      contractReadyTitle: "📄 Your loan contract is ready",
      referenceLabel: "Reference:",
      nextStepsTitle: "Next steps:",
      step1Title: "Download the contract",
      step1Text: "Download and carefully read your loan contract",
      step2Title: "Sign the document",
      step2Text: "Print, sign with the mention \"Read and approved\" followed by your signature",
      step3Title: "Retourner le contrat signé",
      step3Text: "Téléchargez le document signé depuis votre espace client et cliquer sur envoyer.",
      downloadButton: "📥 Télécharger le contrat",
      importantTitle: "⚠️ Important :",
      importantMessage: "Les fonds seront débloqués dans un délai allant de quelques minutes à 24 heures maximum.",
      accessNote: "Vous pouvez également accéder à votre contrat depuis votre espace client à tout moment.",
      contactText: "Des questions ? Contactez-nous à support@kreditpass.org",
      footer: "Tous droits réservés."
    },
    fundingRelease: {
      subject: "Your funds have been released - KreditPass",
      headerTitle: "✅ Funds Released",
      headerSubtitle: "Your money is available",
      greeting: "Hello",
      releaseMessage: "Great news! The funds from your loan of",
      releaseMessage2: "have been successfully released.",
      referenceLabel: "Loan reference:",
      availabilityTitle: "💳 Fund availability",
      availabilityText: "The funds are now available in your account and can be used immediately.",
      nextStepsTitle: "What to do now:",
      step1: "Check your balance in your dashboard",
      step2: "Make a transfer to your bank account",
      step3: "Manage your repayment schedule",
      dashboardButton: "Access dashboard",
      reminderTitle: "📅 Important reminder",
      reminderText: "Don't forget your repayment dates. You can view the complete schedule in your client area.",
      supportText: "Our team remains at your disposal for any questions.",
      contactText: "Questions? Contact us at",
      footer: "All rights reserved."
    },
    otp: {
      subject: "Verification Code - KreditPass",
      headerTitle: "🔐 Two-Factor Authentication",
      greeting: "Hello",
      codeTitle: "Your verification code",
      instruction: "Use the code below to log in to your KreditPass account:",
      expirationText: "This code will expire in 5 minutes.",
      securityWarning: "⚠️ For your security, never share this code with anyone. Our team will never ask you for this code.",
      notYouText: "If you didn't request this code, ignore this email and your account will remain secure.",
      footer: "All rights reserved."
    },
    loanRequestUser: {
      subject: "Your loan request has been received - KreditPass",
      headerTitle: "✅ Loan request received",
      greeting: "Hello",
      confirmationMessage: "We have successfully received your loan request for",
      confirmationMessage2: "for an amount of",
      referenceLabel: "Request reference:",
      nextStepsTitle: "Next steps:",
      step1: "Our team is reviewing your application",
      step2: "You will receive a response within 24-48 hours",
      step3: "If additional documents are needed, we will contact you",
      dashboardText: "You can track the status of your request from your dashboard.",
      dashboardButton: "Access my dashboard",
      supportText: "Our team remains at your disposal for any questions.",
      footer: "All rights reserved."
    },
    loanRequestAdmin: {
      subject: "New loan request - KreditPass",
      headerTitle: "📋 New loan request",
      message: "A new loan request has been submitted and requires your attention.",
      applicantLabel: "Applicant:",
      emailLabel: "Email:",
      phoneLabel: "Phone:",
      accountTypeLabel: "Account type:",
      amountLabel: "Amount requested:",
      durationLabel: "Duration:",
      loanTypeLabel: "Loan type:",
      referenceLabel: "Reference:",
      userIdLabel: "User ID:",
      documentsTitle: "📄 Documents uploaded",
      documentTypeLabel: "Document type",
      downloadLabel: "Download",
      noDocuments: "No documents uploaded",
      monthsLabel: "months",
      actionButton: "Review request",
      footer: "All rights reserved."
    },
    kycUploadedAdmin: {
      subject: "New KYC document uploaded - KreditPass",
      headerTitle: "📄 New KYC document",
      message: "A new KYC document has been uploaded and requires your verification.",
      userLabel: "User:",
      emailLabel: "Email:",
      documentTypeLabel: "Document type:",
      loanTypeLabel: "Loan type:",
      userIdLabel: "User ID:",
      actionButton: "Verify document",
      footer: "All rights reserved."
    },
    loanApprovedUser: {
      subject: "Congratulations! Your loan is approved - KreditPass",
      headerTitle: "🎉 Congratulations!",
      headerSubtitle: "Your loan is approved",
      greeting: "Hello",
      approvalMessage: "Great news! Your loan request for",
      approvalMessage2: "has been approved.",
      referenceLabel: "Reference:",
      nextStepsTitle: "Next steps:",
      step1: "Download your loan contract from your client area",
      step2: "Sign the contract and return it to us",
      step3: "Funds will be released within 24 hours after receiving the signed contract",
      loginButton: "Access my client area",
      importantTitle: "⚠️ Important:",
      importantMessage: "You must sign and return the contract for the funds to be released.",
      supportText: "Our team remains at your disposal for any questions.",
      footer: "All rights reserved."
    },
    transferInitiatedAdmin: {
      subject: "New transfer initiated - KreditPass",
      headerTitle: "💸 New transfer initiated",
      message: "A new transfer has been initiated and requires your attention.",
      userLabel: "User:",
      emailLabel: "Email:",
      amountLabel: "Amount:",
      recipientLabel: "Recipient:",
      transferIdLabel: "Transfer ID:",
      userIdLabel: "User ID:",
      actionButton: "View transfer",
      footer: "All rights reserved."
    },
    transferCodeUser: {
      subject: "Validation code for your transfer - KreditPass",
      headerTitle: "🔐 Validation code",
      greeting: "Hello",
      transferInfoTitle: "Transfer details",
      amountLabel: "Amount:",
      recipientLabel: "Recipient:",
      codeTitle: "Your validation code",
      codeSequence: "Code",
      codeOf: "of",
      instruction: "Use the code below to validate your transfer:",
      expirationText: "This code will expire in 15 minutes.",
      securityWarning: "⚠️ For your security, never share this code with anyone. Our team will never ask you for this code.",
      notYouText: "If you didn't initiate this transfer, contact us immediately.",
      footer: "All rights reserved."
    },
    transferCompletedUser: {
      subject: "Your transfer is complete - KreditPass",
      headerTitle: "✅ Transfer completed successfully",
      greeting: "Hello",
      congratulationsMessage: "Your transfer has been completed successfully after validation of all security codes.",
      summaryTitle: "📋 Transfer summary",
      amountLabel: "Amount transferred:",
      recipientLabel: "Recipient:",
      ibanLabel: "Recipient IBAN:",
      referenceLabel: "Transfer reference:",
      availabilityTitle: "⏱️ Funds availability",
      availabilityMessage: "The funds will be available in the recipient's account within 24 to 72 business hours, depending on banking delays.",
      supportTitle: "💬 Need help?",
      supportMessage: "If you encounter any issues or have questions about this transfer, our team is at your disposal:",
      supportEmail: "Contact us at:",
      thanksMessage: "Thank you for your trust.",
      footer: "All rights reserved."
    },
    transferCompletedAdmin: {
      subject: "Transfer completion report - KreditPass",
      headerTitle: "📊 Transfer completed - Admin report",
      message: "A transfer has been completed successfully. Here is the detailed report:",
      userInfoTitle: "👤 User information",
      userLabel: "User:",
      emailLabel: "Email:",
      userIdLabel: "User ID:",
      transferInfoTitle: "💸 Transfer details",
      amountLabel: "Amount:",
      recipientLabel: "Recipient:",
      ibanLabel: "IBAN:",
      transferIdLabel: "Transfer ID:",
      progressTitle: "✅ Progress and validation",
      validationsLabel: "Codes validated:",
      completedAtLabel: "Completed on:",
      actionButton: "View full details",
      footer: "All rights reserved."
    }
  },
  es: {
    accountTypes: {
      personal: "particular",
      business: "profesional/empresa"
    },
    verification: {
      subject: "Verifica tu dirección de correo electrónico - KreditPass",
      tagline: "Soluciones de financiación",
      greeting: "Hola",
      thankYou: "Gracias por registrarte en KreditPass como",
      instruction: "Para activar tu cuenta y acceder a nuestros servicios de financiación, verifica tu dirección de correo electrónico haciendo clic en el botón a continuación:",
      buttonText: "Verificar mi correo",
      alternativeText: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
      disclaimerText: "Si no creaste una cuenta en KreditPass, puedes ignorar este correo.",
      footer: "Todos los derechos reservados.",
      textVersion: {
        thankYou: "Gracias por registrarte en KreditPass como",
        instruction: "Para activar tu cuenta, verifica tu dirección de correo electrónico visitando este enlace:",
        disclaimer: "Si no creaste una cuenta en KreditPass, puedes ignorar este correo.",
        signature: "KreditPass - Soluciones de financiación"
      }
    },
    welcome: {
      subject: "¡Bienvenido a KreditPass!",
      headerTitle: "🎉 ¡Bienvenido a KreditPass!",
      greeting: "Hola",
      verifiedMessage: "¡Tu correo ha sido verificado con éxito! Tu cuenta",
      activeMessage: "está ahora activa.",
      featuresIntro: "Ya puedes acceder a todas nuestras funcionalidades:",
      features: [
        "Solicitar un préstamo personal o empresarial",
        "Gestionar tus reembolsos",
        "Realizar transferencias",
        "Consultar tu panel de control"
      ],
      buttonText: "Iniciar sesión",
      supportText: "Nuestro equipo está a tu disposición para cualquier pregunta.",
      footer: "Todos los derechos reservados."
    },
    contract: {
      subject: "Tu contrato de préstamo está disponible - KreditPass",
      headerTitle: "🎉 ¡Felicitaciones!",
      headerSubtitle: "Tu préstamo está aprobado",
      greeting: "Hola",
      approvedMessage: "¡Excelente noticia! Tu solicitud de préstamo de",
      approvedMessage2: "ha sido aprobada.",
      contractReadyTitle: "📄 Tu contrato de préstamo está listo",
      referenceLabel: "Referencia:",
      nextStepsTitle: "Próximos pasos:",
      step1Title: "Descargar el contrato",
      step1Text: "Descarga y lee atentamente tu contrato de préstamo",
      step2Title: "Firmar el documento",
      step2Text: "Imprime, firma con la mención \"Leído y aprobado\" seguida de tu firma",
      step3Title: "Devolver el contrato firmado",
      step3Text: "Sube el documento firmado desde tu área de cliente y haz clic en enviar.",
      downloadButton: "📥 Descargar contrato",
      importantTitle: "⚠️ Importante :",
      importantMessage: "Los fondos se liberarán en un plazo de unos minutos a un máximo de 24 horas.",
      accessNote: "También puedes acceder a tu contrato desde tu área de cliente en cualquier momento.",
      contactText: "¿Preguntas? Contáctanos en support@kreditpass.org",
      footer: "Todos los derechos reservados."
    },
    fundingRelease: {
      subject: "Tus fondos han sido liberados - KreditPass",
      headerTitle: "✅ Fondos Liberados",
      headerSubtitle: "Tu dinero está disponible",
      greeting: "Hola",
      releaseMessage: "¡Excelente noticia! Los fondos de tu préstamo de",
      releaseMessage2: "han sido liberados con éxito.",
      referenceLabel: "Referencia del préstamo:",
      availabilityTitle: "💳 Disponibilidad de fondos",
      availabilityText: "Los fondos están ahora disponibles en tu cuenta y pueden ser utilizados inmediatamente.",
      nextStepsTitle: "Qué hacer ahora:",
      step1: "Consulta tu saldo en tu panel de control",
      step2: "Realiza una transferencia a tu cuenta bancaria",
      step3: "Gestiona tu calendario de reembolsos",
      dashboardButton: "Acceder al panel",
      reminderTitle: "📅 Recordatorio importante",
      reminderText: "No olvides tus fechas de reembolso. Puedes ver el calendario completo en tu área de cliente.",
      supportText: "Nuestro equipo sigue a tu disposición para cualquier pregunta.",
      contactText: "¿Preguntas? Contáctanos en",
      footer: "Todos los derechos reservados."
    },
    otp: {
      subject: "Código de verificación - KreditPass",
      headerTitle: "🔐 Autenticación de dos factores",
      greeting: "Hola",
      codeTitle: "Tu código de verificación",
      instruction: "Usa el código a continuación para iniciar sesión en tu cuenta de KreditPass:",
      expirationText: "Este código expirará en 5 minutos.",
      securityWarning: "⚠️ Para tu seguridad, nunca compartas este código con nadie. Nuestro equipo nunca te pedirá este código.",
      notYouText: "Si no solicitaste este código, ignora este correo y tu cuenta permanecerá segura.",
      footer: "Todos los derechos reservados."
    },
    loanRequestUser: {
      subject: "Tu solicitud de préstamo ha sido recibida - KreditPass",
      headerTitle: "✅ Solicitud de préstamo recibida",
      greeting: "Hola",
      confirmationMessage: "Hemos recibido correctamente tu solicitud de préstamo de",
      confirmationMessage2: "por un monto de",
      referenceLabel: "Referencia de la solicitud:",
      nextStepsTitle: "Próximos pasos:",
      step1: "Nuestro equipo está examinando tu solicitud",
      step2: "Recibirás una respuesta en 24-48 horas",
      step3: "Si se necesitan documentos adicionales, te contactaremos",
      dashboardText: "Puedes seguir el estado de tu solicitud desde tu panel de control.",
      dashboardButton: "Acceder a mi panel",
      supportText: "Nuestro equipo sigue a tu disposición para cualquier pregunta.",
      footer: "Todos los derechos reservados."
    },
    loanRequestAdmin: {
      subject: "Nueva solicitud de préstamo - KreditPass",
      headerTitle: "📋 Nueva solicitud de préstamo",
      message: "Se ha enviado una nueva solicitud de préstamo que requiere tu atención.",
      applicantLabel: "Solicitante:",
      emailLabel: "Email:",
      phoneLabel: "Teléfono:",
      accountTypeLabel: "Tipo de cuenta:",
      amountLabel: "Monto solicitado:",
      durationLabel: "Duración:",
      loanTypeLabel: "Tipo de préstamo:",
      referenceLabel: "Referencia:",
      userIdLabel: "ID de usuario:",
      documentsTitle: "📄 Documentos subidos",
      documentTypeLabel: "Tipo de documento",
      downloadLabel: "Descargar",
      noDocuments: "Ningún documento subido",
      monthsLabel: "meses",
      actionButton: "Examinar solicitud",
      footer: "Todos los derechos reservados."
    },
    kycUploadedAdmin: {
      subject: "Nuevo documento KYC cargado - KreditPass",
      headerTitle: "📄 Nuevo documento KYC",
      message: "Se ha cargado un nuevo documento KYC que requiere tu verificación.",
      userLabel: "Usuario:",
      emailLabel: "Email:",
      documentTypeLabel: "Tipo de documento:",
      loanTypeLabel: "Tipo de préstamo:",
      userIdLabel: "ID de usuario:",
      actionButton: "Verificar documento",
      footer: "Todos los derechos reservados."
    },
    loanApprovedUser: {
      subject: "¡Felicitaciones! Tu préstamo está aprobado - KreditPass",
      headerTitle: "🎉 ¡Felicitaciones!",
      headerSubtitle: "Tu préstamo está aprobado",
      greeting: "Hola",
      approvalMessage: "¡Excelente noticia! Tu solicitud de préstamo de",
      approvalMessage2: "ha sido aprobada.",
      referenceLabel: "Referencia:",
      nextStepsTitle: "Próximos pasos:",
      step1: "Descarga tu contrato de préstamo desde tu área de cliente",
      step2: "Firma el contrato y devuélvenoslo",
      step3: "Los fondos se liberarán en 24 horas después de recibir el contrato firmado",
      loginButton: "Acceder a mi área de cliente",
      importantTitle: "⚠️ Importante:",
      importantMessage: "Debes firmar y devolver el contrato para que se liberen los fondos.",
      supportText: "Nuestro equipo sigue a tu disposición para cualquier pregunta.",
      footer: "Todos los derechos reservados."
    },
    transferInitiatedAdmin: {
      subject: "Nueva transferencia iniciada - KreditPass",
      headerTitle: "💸 Nueva transferencia iniciada",
      message: "Se ha iniciado una nueva transferencia que requiere tu atención.",
      userLabel: "Usuario:",
      emailLabel: "Email:",
      amountLabel: "Monto:",
      recipientLabel: "Destinatario:",
      transferIdLabel: "ID de transferencia:",
      userIdLabel: "ID de usuario:",
      actionButton: "Ver transferencia",
      footer: "Todos los derechos reservados."
    },
    transferCodeUser: {
      subject: "Código de validación para tu transferencia - KreditPass",
      headerTitle: "🔐 Código de validación",
      greeting: "Hola",
      transferInfoTitle: "Detalles de la transferencia",
      amountLabel: "Monto:",
      recipientLabel: "Destinatario:",
      codeTitle: "Tu código de validación",
      codeSequence: "Código",
      codeOf: "de",
      instruction: "Usa el código a continuación para validar tu transferencia:",
      expirationText: "Este código expirará en 15 minutos.",
      securityWarning: "⚠️ Para tu seguridad, nunca compartas este código con nadie. Nuestro equipo nunca te pedirá este código.",
      notYouText: "Si no iniciaste esta transferencia, contáctanos inmediatamente.",
      footer: "Todos los derechos reservados."
    },
    transferCompletedUser: {
      subject: "Tu transferencia se ha completado - KreditPass",
      headerTitle: "✅ Transferencia completada con éxito",
      greeting: "Hola",
      congratulationsMessage: "Tu transferencia se ha completado con éxito tras la validación de todos los códigos de seguridad.",
      summaryTitle: "📋 Resumen de la transferencia",
      amountLabel: "Monto transferido:",
      recipientLabel: "Beneficiario:",
      ibanLabel: "IBAN del beneficiario:",
      referenceLabel: "Referencia de la transferencia:",
      availabilityTitle: "⏱️ Disponibilidad de fondos",
      availabilityMessage: "Los fondos estarán disponibles en la cuenta del beneficiario en un plazo de 24 a 72 horas hábiles, según los tiempos bancarios.",
      supportTitle: "💬 ¿Necesitas ayuda?",
      supportMessage: "Si encuentras algún problema o tienes preguntas sobre esta transferencia, nuestro equipo está a tu disposición:",
      supportEmail: "Contáctanos en:",
      thanksMessage: "Gracias por tu confianza.",
      footer: "Todos los derechos reservados."
    }
  },
  pt: {
    accountTypes: {
      personal: "particular",
      business: "profissional/empresa"
    },
    verification: {
      subject: "Verifique seu endereço de email - KreditPass",
      tagline: "Soluções de financiamento",
      greeting: "Olá",
      thankYou: "Obrigado por se inscrever no KreditPass como",
      instruction: "Para ativar sua conta e acessar nossos serviços de financiamento, verifique seu endereço de email clicando no botão abaixo:",
      buttonText: "Verificar meu email",
      alternativeText: "Se o botão não funcionar, copie e cole este link no seu navegador:",
      disclaimerText: "Se você não criou uma conta no KreditPass, pode ignorar este email.",
      footer: "Todos os direitos reservados.",
      textVersion: {
        thankYou: "Obrigado por se inscrever no KreditPass como",
        instruction: "Para ativar sua conta, verifique seu endereço de email visitando este link:",
        disclaimer: "Se você não criou uma conta no KreditPass, pode ignorar este email.",
        signature: "KreditPass - Soluções de financiamento"
      }
    },
    welcome: {
      subject: "Bem-vindo ao KreditPass!",
      headerTitle: "🎉 Bem-vindo ao KreditPass!",
      greeting: "Olá",
      verifiedMessage: "Seu email foi verificado com sucesso! Sua conta",
      activeMessage: "está agora ativa.",
      featuresIntro: "Você já pode acessar todas as nossas funcionalidades:",
      features: [
        "Solicitar um empréstimo pessoal ou empresarial",
        "Gerenciar seus reembolsos",
        "Realizar transferências",
        "Consultar seu painel de controle"
      ],
      buttonText: "Entrar",
      supportText: "Nossa equipe está à sua disposição para qualquer dúvida.",
      footer: "Todos os direitos reservados."
    },
    contract: {
      subject: "Seu contrato de empréstimo está disponível - KreditPass",
      headerTitle: "🎉 Parabéns!",
      headerSubtitle: "Seu empréstimo foi aprovado",
      greeting: "Olá",
      approvedMessage: "Excelente notícia! Sua solicitação de empréstimo de",
      approvedMessage2: "foi aprovada.",
      contractReadyTitle: "📄 Seu contrato de empréstimo está pronto",
      referenceLabel: "Referência:",
      nextStepsTitle: "Próximos passos:",
      step1Title: "Baixar o contrato",
      step1Text: "Baixe e leia atentamente seu contrato de empréstimo",
      step2Title: "Assinar o documento",
      step2Text: "Imprima, assine com a menção \"Lido e aprovado\" seguida de sua assinatura",
      step3Title: "Devolver o contrato assinado",
      step3Text: "Carregue o documento assinado da sua área de cliente e clique em enviar.",
      downloadButton: "📥 Baixar contrato",
      importantTitle: "⚠️ Important :",
      importantMessage: "Os fundos serão liberados dentro de alguns minutos a um máximo de 24 horas.",
      accessNote: "Você também pode acessar seu contrato da sua área de cliente a qualquer momento.",
      contactText: "Dúvidas? Entre em contato conosco em support@kreditpass.org",
      footer: "Todos os direitos reservados."
    },
    fundingRelease: {
      subject: "Seus fundos foram liberados - KreditPass",
      headerTitle: "✅ Fundos Liberados",
      headerSubtitle: "Seu dinheiro está disponível",
      greeting: "Olá",
      releaseMessage: "Excelente notícia! Os fundos do seu empréstimo de",
      releaseMessage2: "foram liberados com sucesso.",
      referenceLabel: "Referência do empréstimo:",
      availabilityTitle: "💳 Disponibilidade de fundos",
      availabilityText: "Os fundos estão agora disponíveis na sua conta e podem ser usados imediatamente.",
      nextStepsTitle: "O que fazer agora:",
      step1: "Consulte seu saldo no seu painel de controle",
      step2: "Realize uma transferência para sua conta bancária",
      step3: "Gerencie seu cronograma de reembolso",
      dashboardButton: "Acessar painel",
      reminderTitle: "📅 Lembrete importante",
      reminderText: "Não esqueça suas datas de reembolso. Você pode ver o cronograma completo na sua área de cliente.",
      supportText: "Nossa equipe continua à sua disposição para qualquer dúvida.",
      contactText: "Dúvidas? Entre em contato conosco em",
      footer: "Todos os direitos reservados."
    },
    otp: {
      subject: "Código de verificação - KreditPass",
      headerTitle: "🔐 Autenticação de dois fatores",
      greeting: "Olá",
      codeTitle: "Seu código de verificação",
      instruction: "Use o código abaixo para fazer login na sua conta KreditPass:",
      expirationText: "Este código expirará em 5 minutos.",
      securityWarning: "⚠️ Para sua segurança, nunca compartilhe este código com ninguém. Nossa equipe nunca pedirá este código.",
      notYouText: "Se você não solicitou este código, ignore este email e sua conta permanecerá segura.",
      footer: "Todos os direitos reservados."
    },
    loanRequestUser: {
      subject: "Sua solicitação de empréstimo foi recebida - KreditPass",
      headerTitle: "✅ Solicitação de empréstimo recebida",
      greeting: "Olá",
      confirmationMessage: "Recebemos com sucesso sua solicitação de empréstimo de",
      confirmationMessage2: "no valor de",
      referenceLabel: "Referência da solicitação:",
      nextStepsTitle: "Próximos passos:",
      step1: "Nossa equipe está analisando sua solicitação",
      step2: "Você receberá uma resposta em 24-48 horas",
      step3: "Se documentos adicionais forem necessários, entraremos em contato",
      dashboardText: "Você pode acompanhar o status da sua solicitação no seu painel de controle.",
      dashboardButton: "Acessar meu painel",
      supportText: "Nossa equipe continua à sua disposição para qualquer dúvida.",
      footer: "Todos os direitos reservados."
    },
    loanRequestAdmin: {
      subject: "Nova solicitação de empréstimo - KreditPass",
      headerTitle: "📋 Nova solicitação de empréstimo",
      message: "Uma nova solicitação de empréstimo foi enviada e requer sua atenção.",
      applicantLabel: "Solicitante:",
      emailLabel: "Email:",
      phoneLabel: "Telefone:",
      accountTypeLabel: "Tipo de conta:",
      amountLabel: "Valor solicitado:",
      durationLabel: "Duração:",
      loanTypeLabel: "Tipo de empréstimo:",
      referenceLabel: "Referência:",
      userIdLabel: "ID do usuário:",
      documentsTitle: "📄 Documentos enviados",
      documentTypeLabel: "Tipo de documento",
      downloadLabel: "Baixar",
      noDocuments: "Nenhum documento enviado",
      monthsLabel: "meses",
      actionButton: "Analisar solicitação",
      footer: "Todos os direitos reservados."
    },
    kycUploadedAdmin: {
      subject: "Novo documento KYC enviado - KreditPass",
      headerTitle: "📄 Novo documento KYC",
      message: "Um novo documento KYC foi enviado e requer sua verificação.",
      userLabel: "Usuário:",
      emailLabel: "Email:",
      documentTypeLabel: "Tipo de documento:",
      loanTypeLabel: "Tipo de empréstimo:",
      userIdLabel: "ID do usuário:",
      actionButton: "Verificar documento",
      footer: "Todos os direitos reservados."
    },
    loanApprovedUser: {
      subject: "Parabéns! Seu empréstimo foi aprovado - KreditPass",
      headerTitle: "🎉 Parabéns!",
      headerSubtitle: "Seu empréstimo foi aprovado",
      greeting: "Olá",
      approvalMessage: "Excelente notícia! Sua solicitação de empréstimo de",
      approvalMessage2: "foi aprovada.",
      referenceLabel: "Referência:",
      nextStepsTitle: "Próximos passos:",
      step1: "Baixe seu contrato de empréstimo da sua área de cliente",
      step2: "Assine o contrato e devolva-o para nós",
      step3: "Os fundos serão liberados em 24 horas após o recebimento do contrato assinado",
      loginButton: "Acessar minha área de cliente",
      importantTitle: "⚠️ Importante:",
      importantMessage: "Você deve assinar e devolver o contrato para que os fundos sejam liberados.",
      supportText: "Nossa equipe continua à sua disposição para qualquer dúvida.",
      footer: "Todos os direitos reservados."
    },
    transferInitiatedAdmin: {
      subject: "Nova transferência iniciada - KreditPass",
      headerTitle: "💸 Nova transferência iniciada",
      message: "Uma nova transferência foi iniciada e requer sua atenção.",
      userLabel: "Usuário:",
      emailLabel: "Email:",
      amountLabel: "Valor:",
      recipientLabel: "Destinatário:",
      transferIdLabel: "ID da transferência:",
      userIdLabel: "ID do usuário:",
      actionButton: "Ver transferência",
      footer: "Todos os direitos reservados."
    },
    transferCodeUser: {
      subject: "Código de validação para sua transferência - KreditPass",
      headerTitle: "🔐 Código de validação",
      greeting: "Olá",
      transferInfoTitle: "Detalhes da transferência",
      amountLabel: "Valor:",
      recipientLabel: "Destinatário:",
      codeTitle: "Seu código de validação",
      codeSequence: "Código",
      codeOf: "de",
      instruction: "Use o código abaixo para validar sua transferência:",
      expirationText: "Este código expirará em 15 minutos.",
      securityWarning: "⚠️ Para sua segurança, nunca compartilhe este código com ninguém. Nossa equipe nunca pedirá este código.",
      notYouText: "Se você não iniciou esta transferência, entre em contato conosco imediatamente.",
      footer: "Todos os direitos reservados."
    },
    transferCompletedUser: {
      subject: "Sua transferência foi concluída - KreditPass",
      headerTitle: "✅ Transferência concluída com sucesso",
      greeting: "Olá",
      congratulationsMessage: "Sua transferência foi concluída com sucesso após a validação de todos os códigos de segurança.",
      summaryTitle: "📋 Resumo da transferência",
      amountLabel: "Valor transferido:",
      recipientLabel: "Beneficiário:",
      ibanLabel: "IBAN do beneficiário:",
      referenceLabel: "Referência da transferência:",
      availabilityTitle: "⏱️ Disponibilidade dos fundos",
      availabilityMessage: "Os fundos estarão disponíveis na conta do beneficiário em 24 a 72 horas úteis, dependendo dos prazos bancários.",
      supportTitle: "💬 Precisa de ajuda?",
      supportMessage: "Se encontrar algum problema ou tiver dúvidas sobre esta transferência, nossa equipe está à sua disposição:",
      supportEmail: "Entre em contato conosco em:",
      thanksMessage: "Obrigado pela sua confiança.",
      footer: "Todos os direitos reservados."
    }
  },
  it: {
    accountTypes: {
      personal: "particolare",
      business: "professionale/aziendale"
    },
    verification: {
      subject: "Verifica il tuo indirizzo email - KreditPass",
      tagline: "Soluzioni di finanziamento",
      greeting: "Ciao",
      thankYou: "Grazie per esserti iscritto su KreditPass come",
      instruction: "Per attivare il tuo account e accedere ai nostri servizi di finanziamento, verifica il tuo indirizzo email cliccando sul pulsante qui sotto:",
      buttonText: "Verifica la mia email",
      alternativeText: "Se il pulsante non funziona, copia e incolla questo link nel tuo browser:",
      disclaimerText: "Se non hai creato un account su KreditPass, puoi ignorare questa email.",
      footer: "Tutti i diritti riservati.",
      textVersion: {
        thankYou: "Grazie per esserti iscritto su KreditPass come",
        instruction: "Per attivare il tuo account, verifica il tuo indirizzo email visitando questo link:",
        disclaimer: "Se non hai creato un account su KreditPass, puoi ignorare questa email.",
        signature: "KreditPass - Soluzioni di finanziamento"
      }
    },
    welcome: {
      subject: "Benvenuto su KreditPass!",
      headerTitle: "🎉 Benvenuto su KreditPass!",
      greeting: "Ciao",
      verifiedMessage: "La tua email è stata verificata con successo! Il tuo account",
      activeMessage: "è ora attivo.",
      featuresIntro: "Puoi ora accedere a tutte le nostre funzionalità:",
      features: [
        "Richiedere un prestito personale o aziendale",
        "Gestire i tuoi rimborsi",
        "Effettuare trasferimenti",
        "Consultare la tua dashboard"
      ],
      buttonText: "Accedi",
      supportText: "Il nostro team è a tua disposizione per qualsiasi domanda.",
      footer: "Tutti i diritti riservati."
    },
    contract: {
      subject: "Il tuo contratto di prestito è disponibile - KreditPass",
      headerTitle: "🎉 Congratulazioni!",
      headerSubtitle: "Il tuo prestito è approvato",
      greeting: "Ciao",
      approvedMessage: "Ottima notizia! La tua richiesta di prestito di",
      approvedMessage2: "è stata approvata.",
      contractReadyTitle: "📄 Il tuo contratto di prestito è pronto",
      referenceLabel: "Riferimento:",
      nextStepsTitle: "Prossimi passi:",
      step1Title: "Scaricare il contratto",
      step1Text: "Scarica e leggi attentamente il tuo contratto di prestito",
      step2Title: "Firmare il documento",
      step2Text: "Stampa, firma con la dicitura \"Letto e approvato\" seguita dalla tua firma",
      step3Title: "Restituire il contratto firmato",
      step3Text: "Carica il documento firmato dalla tua area cliente e clicca su invia.",
      downloadButton: "📥 Scarica contratto",
      importantTitle: "⚠️ Importante:",
      importantMessage: "I fondi saranno rilasciati entro pochi minuti fino a un massimo di 24 ore.",
      accessNote: "Puoi anche accedere al tuo contratto dalla tua area cliente in qualsiasi momento.",
      contactText: "Domande? Contattaci a support@kreditpass.org",
      footer: "Tutti i diritti riservati."
    },
    fundingRelease: {
      subject: "I tuoi fondi sono stati rilasciati - KreditPass",
      headerTitle: "✅ Fondi Rilasciati",
      headerSubtitle: "Il tuo denaro è disponibile",
      greeting: "Ciao",
      releaseMessage: "Ottima notizia! I fondi del tuo prestito di",
      releaseMessage2: "sono stati rilasciati con successo.",
      referenceLabel: "Riferimento prestito:",
      availabilityTitle: "💳 Disponibilità fondi",
      availabilityText: "I fondi sono ora disponibili sul tuo account e possono essere utilizzati immediatamente.",
      nextStepsTitle: "Cosa fare ora:",
      step1: "Consulta il tuo saldo nella tua dashboard",
      step2: "Effettua un trasferimento sul tuo conto bancario",
      step3: "Gestisci il tuo piano di rimborso",
      dashboardButton: "Accedi alla dashboard",
      reminderTitle: "📅 Promemoria importante",
      reminderText: "Non dimenticare le tue scadenze di rimborso. Puoi visualizzare il calendario completo nella tua area cliente.",
      supportText: "Il nostro team rimane a tua disposizione per qualsiasi domanda.",
      contactText: "Domande? Contattaci a",
      footer: "Tutti i diritti riservati."
    },
    otp: {
      subject: "Codice di verifica - KreditPass",
      headerTitle: "🔐 Autenticazione a due fattori",
      greeting: "Ciao",
      codeTitle: "Il tuo codice di verifica",
      instruction: "Usa il codice qui sotto per accedere al tuo account KreditPass:",
      expirationText: "Questo codice scadrà tra 5 minuti.",
      securityWarning: "⚠️ Per la tua sicurezza, non condividere mai questo codice con nessuno. Il nostro team non ti chiederà mai questo codice.",
      notYouText: "Se non hai richiesto questo codice, ignora questa email e il tuo account rimarrà sicuro.",
      footer: "Tutti i diritti riservati."
    },
    loanRequestUser: {
      subject: "La tua richiesta di prestito è stata ricevuta - KreditPass",
      headerTitle: "✅ Richiesta di prestito ricevuta",
      greeting: "Ciao",
      confirmationMessage: "Abbiamo ricevuto con successo la tua richiesta di prestito di",
      confirmationMessage2: "per un importo di",
      referenceLabel: "Riferimento richiesta:",
      nextStepsTitle: "Prossimi passi:",
      step1: "Il nostro team sta esaminando la tua richiesta",
      step2: "Riceverai una risposta entro 24-48 ore",
      step3: "Se saranno necessari documenti aggiuntivi, ti contatteremo",
      dashboardText: "Puoi monitorare lo stato della tua richiesta dalla tua dashboard.",
      dashboardButton: "Accedi alla mia dashboard",
      supportText: "Il nostro team rimane a tua disposizione per qualsiasi domanda.",
      footer: "Tutti i diritti riservati."
    },
    loanRequestAdmin: {
      subject: "Nuova richiesta di prestito - KreditPass",
      headerTitle: "📋 Nuova richiesta di prestito",
      message: "È stata inviata una nuova richiesta di prestito che richiede la tua attenzione.",
      applicantLabel: "Richiedente:",
      emailLabel: "Email:",
      phoneLabel: "Telefono:",
      accountTypeLabel: "Tipo di account:",
      amountLabel: "Importo richiesto:",
      durationLabel: "Durata:",
      loanTypeLabel: "Tipo di prestito:",
      referenceLabel: "Riferimento:",
      userIdLabel: "ID utente:",
      documentsTitle: "📄 Documenti caricati",
      documentTypeLabel: "Tipo di documento",
      downloadLabel: "Scarica",
      noDocuments: "Nessun documento caricato",
      monthsLabel: "mesi",
      actionButton: "Esamina richiesta",
      footer: "Tutti i diritti riservati."
    },
    kycUploadedAdmin: {
      subject: "Nuovo documento KYC caricato - KreditPass",
      headerTitle: "📄 Nuovo documento KYC",
      message: "È stato caricato un nuovo documento KYC che richiede la tua verifica.",
      userLabel: "Utente:",
      emailLabel: "Email:",
      documentTypeLabel: "Tipo di documento:",
      loanTypeLabel: "Tipo di prestito:",
      userIdLabel: "ID utente:",
      actionButton: "Verifica documento",
      footer: "Tutti i diritti riservati."
    },
    loanApprovedUser: {
      subject: "Congratulazioni! Il tuo prestito è approvato - KreditPass",
      headerTitle: "🎉 Congratulazioni!",
      headerSubtitle: "Il tuo prestito è approvato",
      greeting: "Ciao",
      approvalMessage: "Ottima notizia! La tua richiesta di prestito di",
      approvalMessage2: "è stata approvata.",
      referenceLabel: "Riferimento:",
      nextStepsTitle: "Prossimi passi:",
      step1: "Scarica il tuo contratto di prestito dalla tua area cliente",
      step2: "Firma il contratto e restituiscilo",
      step3: "I fondi saranno rilasciati entro 24 ore dalla ricezione del contratto firmato",
      loginButton: "Accedi alla mia area cliente",
      importantTitle: "⚠️ Importante:",
      importantMessage: "Devi firmare e restituire il contratto affinché i fondi vengano rilasciati.",
      supportText: "Il nostro team rimane a tua disposizione per qualsiasi domanda.",
      footer: "Tutti i diritti riservati."
    },
    transferInitiatedAdmin: {
      subject: "Nuovo trasferimento avviato - KreditPass",
      headerTitle: "💸 Nuovo trasferimento avviato",
      message: "È stato avviato un nuovo trasferimento che richiede la tua attenzione.",
      userLabel: "Utente:",
      emailLabel: "Email:",
      amountLabel: "Importo:",
      recipientLabel: "Destinatario:",
      transferIdLabel: "ID trasferimento:",
      userIdLabel: "ID utente:",
      actionButton: "Visualizza trasferimento",
      footer: "Tutti i diritti riservati."
    },
    transferCodeUser: {
      subject: "Codice di convalida per il tuo trasferimento - KreditPass",
      headerTitle: "🔐 Codice di convalida",
      greeting: "Ciao",
      transferInfoTitle: "Dettagli trasferimento",
      amountLabel: "Importo:",
      recipientLabel: "Destinatario:",
      codeTitle: "Il tuo codice di convalida",
      codeSequence: "Codice",
      codeOf: "di",
      instruction: "Usa il codice qui sotto per convalidare il tuo trasferimento:",
      expirationText: "Questo codice scadrà tra 15 minuti.",
      securityWarning: "⚠️ Per la tua sicurezza, non condividere mai questo codice con nessuno. Il nostro team non ti chiederà mai questo codice.",
      notYouText: "Se non hai avviato questo trasferimento, contattaci immediatamente.",
      footer: "Tutti i diritti riservati."
    },
    transferCompletedUser: {
      subject: "Il tuo trasferimento è stato completato - KreditPass",
      headerTitle: "✅ Trasferimento completato con successo",
      greeting: "Ciao",
      congratulationsMessage: "Il tuo trasferimento è stato completato con successo dopo la convalida di tutti i codici di sicurezza.",
      summaryTitle: "📋 Riepilogo del trasferimento",
      amountLabel: "Importo trasferito:",
      recipientLabel: "Beneficiario:",
      ibanLabel: "IBAN del beneficiario:",
      referenceLabel: "Riferimento del trasferimento:",
      availabilityTitle: "⏱️ Disponibilità dei fondi",
      availabilityMessage: "I fondi saranno disponibili sul conto del beneficiario entro 24-72 ore lavorative, a seconda dei tempi bancari.",
      supportTitle: "💬 Hai bisogno di aiuto?",
      supportMessage: "Se riscontri problemi o hai domande su questo trasferimento, il nostro team è a tua disposizione:",
      supportEmail: "Contattaci a:",
      thanksMessage: "Grazie per la tua fiducia.",
      footer: "Tutti i diritti riservati."
    }
  },
  de: {
    accountTypes: {
      personal: "privat",
      business: "geschäftlich/unternehmen"
    },
    verification: {
      subject: "Bestätigen Sie Ihre E-Mail-Adresse - KreditPass",
      tagline: "Finanzierungslösungen",
      greeting: "Hallo",
      thankYou: "Vielen Dank für Ihre Anmeldung bei KreditPass als",
      instruction: "Um Ihr Konto zu aktivieren und auf unsere Finanzierungsdienstleistungen zuzugreifen, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:",
      buttonText: "Meine E-Mail bestätigen",
      alternativeText: "Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
      disclaimerText: "Wenn Sie kein Konto bei KreditPass erstellt haben, können Sie diese E-Mail ignorieren.",
      footer: "Alle Rechte vorbehalten.",
      textVersion: {
        thankYou: "Vielen Dank für Ihre Anmeldung bei KreditPass als",
        instruction: "Um Ihr Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie diesen Link besuchen:",
        disclaimer: "Wenn Sie kein Konto bei KreditPass erstellt haben, können Sie diese E-Mail ignorieren.",
        signature: "KreditPass - Finanzierungslösungen"
      }
    },
    welcome: {
      subject: "Willkommen bei KreditPass!",
      headerTitle: "🎉 Willkommen bei KreditPass!",
      greeting: "Hallo",
      verifiedMessage: "Ihre E-Mail wurde erfolgreich bestätigt! Ihr Konto",
      activeMessage: "ist jetzt aktiv.",
      featuresIntro: "Sie können jetzt auf alle unsere Funktionen zugreifen:",
      features: [
        "Einen persönlichen oder geschäftlichen Kredit beantragen",
        "Ihre Rückzahlungen verwalten",
        "Überweisungen tätigen",
        "Ihr Dashboard einsehen"
      ],
      buttonText: "Anmelden",
      supportText: "Unser Team steht Ihnen für alle Fragen zur Verfügung.",
      footer: "Alle Rechte vorbehalten."
    },
    contract: {
      subject: "Ihr Kreditvertrag ist verfügbar - KreditPass",
      headerTitle: "🎉 Herzlichen Glückwunsch!",
      headerSubtitle: "Ihr Kredit wurde genehmigt",
      greeting: "Hallo",
      approvedMessage: "Tolle Neuigkeiten! Ihr Kreditantrag über",
      approvedMessage2: "wurde genehmigt.",
      contractReadyTitle: "📄 Ihr Kreditvertrag ist bereit",
      referenceLabel: "Referenz:",
      nextStepsTitle: "Nächste Schritte:",
      step1Title: "Vertrag herunterladen",
      step1Text: "Laden Sie Ihren Kreditvertrag herunter und lesen Sie ihn sorgfältig",
      step2Title: "Dokument unterschreiben",
      step2Text: "Drucken Sie es aus, unterschreiben Sie es mit dem Vermerk \"Gelesen und genehmigt\", gefolgt von Ihrer Unterschrift",
      step3Title: "Unterschriebenen Vertrag zurückgeben",
      step3Text: "Laden Sie das unterschriebene Dokument aus Ihrem Kundenbereich hoch und klicken Sie auf Senden.",
      downloadButton: "📥 Vertrag herunterladen",
      importantTitle: "⚠️ Wichtig:",
      importantMessage: "Die Mittel werden innerhalb von wenigen Minuten bis maximal 24 Stunden freigegeben.",
      accessNote: "Sie können jederzeit über Ihren Kundenbereich auf Ihren Vertrag zugreifen.",
      contactText: "Fragen? Kontaktieren Sie uns unter support@kreditpass.org",
      footer: "Alle Rechte vorbehalten."
    },
    fundingRelease: {
      subject: "Ihre Mittel wurden freigegeben - KreditPass",
      headerTitle: "✅ Mittel Freigegeben",
      headerSubtitle: "Ihr Geld ist verfügbar",
      greeting: "Hallo",
      releaseMessage: "Tolle Neuigkeiten! Die Mittel Ihres Kredits über",
      releaseMessage2: "wurden erfolgreich freigegeben.",
      referenceLabel: "Kreditreferenz:",
      availabilityTitle: "💳 Verfügbarkeit der Mittel",
      availabilityText: "Die Mittel sind jetzt auf Ihrem Konto verfügbar und können sofort verwendet werden.",
      nextStepsTitle: "Was jetzt zu tun ist:",
      step1: "Überprüfen Sie Ihren Kontostand in Ihrem Dashboard",
      step2: "Tätigen Sie eine Überweisung auf Ihr Bankkonto",
      step3: "Verwalten Sie Ihren Rückzahlungsplan",
      dashboardButton: "Zum Dashboard",
      reminderTitle: "📅 Wichtige Erinnerung",
      reminderText: "Vergessen Sie nicht Ihre Rückzahlungstermine. Sie können den vollständigen Zeitplan in Ihrem Kundenbereich einsehen.",
      supportText: "Unser Team steht Ihnen weiterhin für alle Fragen zur Verfügung.",
      contactText: "Fragen? Kontaktieren Sie uns unter",
      footer: "Alle Rechte vorbehalten."
    },
    otp: {
      subject: "Bestätigungscode - KreditPass",
      headerTitle: "🔐 Zwei-Faktor-Authentifizierung",
      greeting: "Hallo",
      codeTitle: "Ihr Bestätigungscode",
      instruction: "Verwenden Sie den unten stehenden Code, um sich bei Ihrem KreditPass-Konto anzumelden:",
      expirationText: "Dieser Code läuft in 5 Minuten ab.",
      securityWarning: "⚠️ Zu Ihrer Sicherheit teilen Sie diesen Code niemals mit jemandem. Unser Team wird Sie niemals nach diesem Code fragen.",
      notYouText: "Wenn Sie diesen Code nicht angefordert haben, ignorieren Sie diese E-Mail und Ihr Konto bleibt sicher.",
      footer: "Alle Rechte vorbehalten."
    },
    loanRequestUser: {
      subject: "Ihr Kreditantrag wurde erhalten - KreditPass",
      headerTitle: "✅ Kreditantrag erhalten",
      greeting: "Hallo",
      confirmationMessage: "Wir haben Ihren Kreditantrag erfolgreich erhalten für",
      confirmationMessage2: "über einen Betrag von",
      referenceLabel: "Antragsreferenz:",
      nextStepsTitle: "Nächste Schritte:",
      step1: "Unser Team prüft Ihren Antrag",
      step2: "Sie erhalten innerhalb von 24-48 Stunden eine Antwort",
      step3: "Falls zusätzliche Dokumente benötigt werden, werden wir Sie kontaktieren",
      dashboardText: "Sie können den Status Ihres Antrags über Ihr Dashboard verfolgen.",
      dashboardButton: "Zu meinem Dashboard",
      supportText: "Unser Team steht Ihnen weiterhin für alle Fragen zur Verfügung.",
      footer: "Alle Rechte vorbehalten."
    },
    loanRequestAdmin: {
      subject: "Neuer Kreditantrag - KreditPass",
      headerTitle: "📋 Neuer Kreditantrag",
      message: "Ein neuer Kreditantrag wurde eingereicht und benötigt Ihre Aufmerksamkeit.",
      applicantLabel: "Antragsteller:",
      emailLabel: "E-Mail:",
      phoneLabel: "Telefon:",
      accountTypeLabel: "Kontotyp:",
      amountLabel: "Beantragter Betrag:",
      durationLabel: "Laufzeit:",
      loanTypeLabel: "Kreditart:",
      referenceLabel: "Referenz:",
      userIdLabel: "Benutzer-ID:",
      documentsTitle: "📄 Hochgeladene Dokumente",
      documentTypeLabel: "Dokumenttyp",
      downloadLabel: "Herunterladen",
      noDocuments: "Keine Dokumente hochgeladen",
      monthsLabel: "Monate",
      actionButton: "Antrag prüfen",
      footer: "Alle Rechte vorbehalten."
    },
    kycUploadedAdmin: {
      subject: "Neues KYC-Dokument hochgeladen - KreditPass",
      headerTitle: "📄 Neues KYC-Dokument",
      message: "Ein neues KYC-Dokument wurde hochgeladen und benötigt Ihre Überprüfung.",
      userLabel: "Benutzer:",
      emailLabel: "E-Mail:",
      documentTypeLabel: "Dokumenttyp:",
      loanTypeLabel: "Kreditart:",
      userIdLabel: "Benutzer-ID:",
      actionButton: "Dokument überprüfen",
      footer: "Alle Rechte vorbehalten."
    },
    loanApprovedUser: {
      subject: "Glückwunsch! Ihr Kredit wurde genehmigt - KreditPass",
      headerTitle: "🎉 Glückwunsch!",
      headerSubtitle: "Ihr Kredit wurde genehmigt",
      greeting: "Hallo",
      approvalMessage: "Tolle Neuigkeiten! Ihr Kreditantrag über",
      approvalMessage2: "wurde genehmigt.",
      referenceLabel: "Referenz:",
      nextStepsTitle: "Nächste Schritte:",
      step1: "Laden Sie Ihren Kreditvertrag aus Ihrem Kundenbereich herunter",
      step2: "Unterschreiben Sie den Vertrag und senden Sie ihn an uns zurück",
      step3: "Die Mittel werden innerhalb von 24 Stunden nach Erhalt des unterschriebenen Vertrags freigegeben",
      loginButton: "Zu meinem Kundenbereich",
      importantTitle: "⚠️ Wichtig:",
      importantMessage: "Sie müssen den Vertrag unterschreiben und zurücksenden, damit die Mittel freigegeben werden.",
      supportText: "Unser Team steht Ihnen weiterhin für alle Fragen zur Verfügung.",
      footer: "Alle Rechte vorbehalten."
    },
    transferInitiatedAdmin: {
      subject: "Neue Überweisung initiiert - KreditPass",
      headerTitle: "💸 Neue Überweisung initiiert",
      message: "Eine neue Überweisung wurde initiiert und benötigt Ihre Aufmerksamkeit.",
      userLabel: "Benutzer:",
      emailLabel: "E-Mail:",
      amountLabel: "Betrag:",
      recipientLabel: "Empfänger:",
      transferIdLabel: "Überweisungs-ID:",
      userIdLabel: "Benutzer-ID:",
      actionButton: "Überweisung anzeigen",
      footer: "Alle Rechte vorbehalten."
    },
    transferCodeUser: {
      subject: "Bestätigungscode für Ihre Überweisung - KreditPass",
      headerTitle: "🔐 Bestätigungscode",
      greeting: "Hallo",
      transferInfoTitle: "Überweisungsdetails",
      amountLabel: "Betrag:",
      recipientLabel: "Empfänger:",
      codeTitle: "Ihr Bestätigungscode",
      codeSequence: "Code",
      codeOf: "von",
      instruction: "Verwenden Sie den unten stehenden Code, um Ihre Überweisung zu bestätigen:",
      expirationText: "Dieser Code läuft in 15 Minuten ab.",
      securityWarning: "⚠️ Zu Ihrer Sicherheit teilen Sie diesen Code niemals mit jemandem. Unser Team wird Sie niemals nach diesem Code fragen.",
      notYouText: "Wenn Sie diese Überweisung nicht initiiert haben, kontaktieren Sie uns sofort.",
      footer: "Alle Rechte vorbehalten."
    },
    transferCompletedUser: {
      subject: "Ihre Überweisung wurde abgeschlossen - KreditPass",
      headerTitle: "✅ Überweisung erfolgreich abgeschlossen",
      greeting: "Hallo",
      congratulationsMessage: "Ihre Überweisung wurde nach der Validierung aller Sicherheitscodes erfolgreich abgeschlossen.",
      summaryTitle: "📋 Überweisungsübersicht",
      amountLabel: "Überwiesener Betrag:",
      recipientLabel: "Empfänger:",
      ibanLabel: "IBAN des Empfängers:",
      referenceLabel: "Überweisungsreferenz:",
      availabilityTitle: "⏱️ Verfügbarkeit der Mittel",
      availabilityMessage: "Die Mittel werden innerhalb von 24 bis 72 Geschäftsstunden auf dem Konto des Empfängers verfügbar sein, abhängig von den Bankzeiten.",
      supportTitle: "💬 Brauchen Sie Hilfe?",
      supportMessage: "Wenn Sie Probleme haben oder Fragen zu dieser Überweisung haben, steht Ihnen unser Team zur Verfügung:",
      supportEmail: "Kontaktieren Sie uns unter:",
      thanksMessage: "Vielen Dank für Ihr Vertrauen.",
      footer: "Alle Rechte vorbehalten."
    }
  },
  nl: {
    accountTypes: {
      personal: "particulier",
      business: "professioneel/zakelijk"
    },
    verification: {
      subject: "Verifieer uw e-mailadres - KreditPass",
      tagline: "Financieringsoplossingen",
      greeting: "Hallo",
      thankYou: "Bedankt voor uw aanmelding bij KreditPass als",
      instruction: "Om uw account te activeren en toegang te krijgen tot onze financieringsdiensten, verifieert u uw e-mailadres door op de onderstaande knop te klikken:",
      buttonText: "Verifieer mijn e-mail",
      alternativeText: "Als de knop niet werkt, kopieer en plak deze link in uw browser:",
      disclaimerText: "Als u geen account heeft aangemaakt bij KreditPass, kunt u deze e-mail negeren.",
      footer: "Alle rechten voorbehouden.",
      textVersion: {
        thankYou: "Bedankt voor uw aanmelding bij KreditPass als",
        instruction: "Om uw account te activeren, verifieert u uw e-mailadres door deze link te bezoeken:",
        disclaimer: "Als u geen account heeft aangemaakt bij KreditPass, kunt u deze e-mail negeren.",
        signature: "KreditPass - Financieringsoplossingen"
      }
    },
    welcome: {
      subject: "Welkom bij KreditPass!",
      headerTitle: "🎉 Welkom bij KreditPass!",
      greeting: "Hallo",
      verifiedMessage: "Uw e-mail is succesvol geverifieerd! Uw account",
      activeMessage: "is nu actief.",
      featuresIntro: "U heeft nu toegang tot al onze functies:",
      features: [
        "Een persoonlijke of zakelijke lening aanvragen",
        "Uw terugbetalingen beheren",
        "Overboekingen uitvoeren",
        "Uw dashboard raadplegen"
      ],
      buttonText: "Inloggen",
      supportText: "Ons team staat tot uw beschikking voor al uw vragen.",
      footer: "Alle rechten voorbehouden."
    },
    contract: {
      subject: "Uw leningscontract is beschikbaar - KreditPass",
      headerTitle: "🎉 Gefeliciteerd!",
      headerSubtitle: "Uw lening is goedgekeurd",
      greeting: "Hallo",
      approvedMessage: "Geweldig nieuws! Uw leningaanvraag voor",
      approvedMessage2: "is goedgekeurd.",
      contractReadyTitle: "📄 Uw leningscontract is klaar",
      referenceLabel: "Referentie:",
      nextStepsTitle: "Volgende stappen:",
      step1Title: "Contract downloaden",
      step1Text: "Download en lees uw leningscontract zorgvuldig",
      step2Title: "Document ondertekenen",
      step2Text: "Afdrukken, ondertekenen met de vermelding \"Gelezen en goedgekeurd\" gevolgd door uw handtekening",
      step3Title: "Ondertekend contract retourneren",
      step3Text: "Upload het ondertekende document vanuit uw klantengebied en klik op verzenden.",
      downloadButton: "📥 Contract downloaden",
      importantTitle: "⚠️ Belangrijk:",
      importantMessage: "De middelen worden vrijgegeven binnen enkele minuten tot maximaal 24 uur.",
      accessNote: "U kunt ook op elk moment toegang krijgen tot uw contract vanuit uw klantengebied.",
      contactText: "Vragen? Neem contact met ons op via support@kreditpass.org",
      footer: "Alle rechten voorbehouden."
    },
    fundingRelease: {
      subject: "Uw middelen zijn vrijgegeven - KreditPass",
      headerTitle: "✅ Middelen Vrijgegeven",
      headerSubtitle: "Uw geld is beschikbaar",
      greeting: "Hallo",
      releaseMessage: "Geweldig nieuws! De middelen van uw lening van",
      releaseMessage2: "zijn succesvol vrijgegeven.",
      referenceLabel: "Lening referentie:",
      availabilityTitle: "💳 Beschikbaarheid van middelen",
      availabilityText: "De middelen zijn nu beschikbaar op uw account en kunnen onmiddellijk worden gebruikt.",
      nextStepsTitle: "Wat nu te doen:",
      step1: "Controleer uw saldo in uw dashboard",
      step2: "Voer een overboeking uit naar uw bankrekening",
      step3: "Beheer uw terugbetalingsschema",
      dashboardButton: "Ga naar dashboard",
      reminderTitle: "📅 Belangrijke herinnering",
      reminderText: "Vergeet uw terugbetalingsdata niet. U kunt het volledige schema bekijken in uw klantengebied.",
      supportText: "Ons team blijft tot uw beschikking voor al uw vragen.",
      contactText: "Vragen? Neem contact met ons op via",
      footer: "Alle rechten voorbehouden."
    },
    otp: {
      subject: "Verificatiecode - KreditPass",
      headerTitle: "🔐 Twee-factor-authenticatie",
      greeting: "Hallo",
      codeTitle: "Uw verificatiecode",
      instruction: "Gebruik de onderstaande code om in te loggen op uw KreditPass-account:",
      expirationText: "Deze code verloopt over 5 minuten.",
      securityWarning: "⚠️ Voor uw veiligheid, deel deze code nooit met iemand. Ons team zal u nooit om deze code vragen.",
      notYouText: "Als u deze code niet heeft aangevraagd, negeer deze e-mail en uw account blijft veilig.",
      footer: "Alle rechten voorbehouden."
    },
    loanRequestUser: {
      subject: "Uw leningaanvraag is ontvangen - KreditPass",
      headerTitle: "✅ Leningaanvraag ontvangen",
      greeting: "Hallo",
      confirmationMessage: "We hebben uw leningaanvraag succesvol ontvangen voor",
      confirmationMessage2: "voor een bedrag van",
      referenceLabel: "Aanvraag referentie:",
      nextStepsTitle: "Volgende stappen:",
      step1: "Ons team onderzoekt uw aanvraag",
      step2: "U ontvangt binnen 24-48 uur een antwoord",
      step3: "Als er extra documenten nodig zijn, nemen we contact met u op",
      dashboardText: "U kunt de status van uw aanvraag volgen via uw dashboard.",
      dashboardButton: "Ga naar mijn dashboard",
      supportText: "Ons team blijft tot uw beschikking voor al uw vragen.",
      footer: "Alle rechten voorbehouden."
    },
    loanRequestAdmin: {
      subject: "Nieuwe leningaanvraag - KreditPass",
      headerTitle: "📋 Nieuwe leningaanvraag",
      message: "Er is een nieuwe leningaanvraag ingediend die uw aandacht vereist.",
      applicantLabel: "Aanvrager:",
      emailLabel: "E-mail:",
      phoneLabel: "Telefoon:",
      accountTypeLabel: "Accounttype:",
      amountLabel: "Aangevraagd bedrag:",
      durationLabel: "Looptijd:",
      loanTypeLabel: "Type lening:",
      referenceLabel: "Referentie:",
      userIdLabel: "Gebruikers-ID:",
      documentsTitle: "📄 Geüploade documenten",
      documentTypeLabel: "Documenttype",
      downloadLabel: "Download",
      noDocuments: "Geen documenten geüpload",
      monthsLabel: "maanden",
      actionButton: "Aanvraag beoordelen",
      footer: "Alle rechten voorbehouden."
    },
    kycUploadedAdmin: {
      subject: "Nieuw KYC-document geüpload - KreditPass",
      headerTitle: "📄 Nieuw KYC-document",
      message: "Er is een nieuw KYC-document geüpload dat uw verificatie vereist.",
      userLabel: "Gebruiker:",
      emailLabel: "E-mail:",
      documentTypeLabel: "Type document:",
      loanTypeLabel: "Type lening:",
      userIdLabel: "Gebruikers-ID:",
      actionButton: "Document verifiëren",
      footer: "Alle rechten voorbehouden."
    },
    loanApprovedUser: {
      subject: "Gefeliciteerd! Uw lening is goedgekeurd - KreditPass",
      headerTitle: "🎉 Gefeliciteerd!",
      headerSubtitle: "Uw lening is goedgekeurd",
      greeting: "Hallo",
      approvalMessage: "Geweldig nieuws! Uw leningaanvraag van",
      approvalMessage2: "is goedgekeurd.",
      referenceLabel: "Referentie:",
      nextStepsTitle: "Volgende stappen:",
      step1: "Download uw leningscontract vanuit uw klantengebied",
      step2: "Onderteken het contract en stuur het naar ons terug",
      step3: "De middelen worden binnen 24 uur na ontvangst van het ondertekende contract vrijgegeven",
      loginButton: "Ga naar mijn klantengebied",
      importantTitle: "⚠️ Belangrijk:",
      importantMessage: "U moet het contract ondertekenen en terugsturen opdat de middelen kunnen worden vrijgegeven.",
      supportText: "Ons team blijft tot uw beschikking voor al uw vragen.",
      footer: "Alle rechten voorbehouden."
    },
    transferInitiatedAdmin: {
      subject: "Nieuwe overboeking geïnitieerd - KreditPass",
      headerTitle: "💸 Nieuwe overboeking geïnitieerd",
      message: "Er is een nieuwe overboeking geïnitieerd die uw aandacht vereist.",
      userLabel: "Gebruiker:",
      emailLabel: "E-mail:",
      amountLabel: "Bedrag:",
      recipientLabel: "Ontvanger:",
      transferIdLabel: "Overboekings-ID:",
      userIdLabel: "Gebruikers-ID:",
      actionButton: "Overboeking bekijken",
      footer: "Alle rechten voorbehouden."
    },
    transferCodeUser: {
      subject: "Validatiecode voor uw overboeking - KreditPass",
      headerTitle: "🔐 Validatiecode",
      greeting: "Hallo",
      transferInfoTitle: "Overboekingsdetails",
      amountLabel: "Bedrag:",
      recipientLabel: "Ontvanger:",
      codeTitle: "Uw validatiecode",
      codeSequence: "Code",
      codeOf: "van",
      instruction: "Gebruik de onderstaande code om uw overboeking te valideren:",
      expirationText: "Deze code verloopt over 15 minuten.",
      securityWarning: "⚠️ Voor uw veiligheid, deel deze code nooit met iemand. Ons team zal u nooit om deze code vragen.",
      notYouText: "Als u deze overboeking niet heeft geïnitieerd, neem dan onmiddellijk contact met ons op.",
      footer: "Alle rechten voorbehouden."
    },
    transferCompletedUser: {
      subject: "Uw overboeking is voltooid - KreditPass",
      headerTitle: "✅ Overboeking succesvol voltooid",
      greeting: "Hallo",
      congratulationsMessage: "Uw overboeking is succesvol voltooid na validatie van alle beveiligingscodes.",
      summaryTitle: "📋 Overzicht van de overboeking",
      amountLabel: "Overgemaakt bedrag:",
      recipientLabel: "Begunstigde:",
      ibanLabel: "IBAN van de begunstigde:",
      referenceLabel: "Referentie van de overboeking:",
      availabilityTitle: "⏱️ Beschikbaarheid van fondsen",
      availabilityMessage: "De fondsen zullen binnen 24 tot 72 werkuren beschikbaar zijn op de rekening van de begunstigde, afhankelijk van de banktijden.",
      supportTitle: "💬 Hulp nodig?",
      supportMessage: "Als u problemen ondervindt of vragen heeft over deze overboeking, staat ons team tot uw beschikking:",
      supportEmail: "Neem contact met ons op via:",
      thanksMessage: "Bedankt voor uw vertrouwen.",
      footer: "Alle rechten voorbehouden."
    }
  }
};

function getVerificationTemplate(lang: Language, vars: VerificationVariables): EmailTemplate {
  const t = (translations[lang] || translations['fr']).verification;
  const accountTypes = (translations[lang] || translations['fr']).accountTypes;
  
  const translatedAccountType = (accountTypes as any)[vars.accountTypeText] || vars.accountTypeText;
  
  const emailContent = `
    ${getEmailHeader({ subtitle: t.tagline })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${t.thankYou} <strong>${escapeHtml(translatedAccountType)}</strong>.</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">${t.instruction}</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <a href="${vars.verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.buttonText}</a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${t.alternativeText}</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 0 0 30px 0;">${vars.verificationUrl}</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.disclaimerText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.textVersion.thankYou} ${translatedAccountType}.

${t.textVersion.instruction}
${vars.verificationUrl}

${t.textVersion.disclaimer}

${t.textVersion.signature}
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getWelcomeTemplate(lang: Language, vars: WelcomeVariables): EmailTemplate {
  const t = (translations[lang] || translations['fr']).welcome;
  const accountTypes = (translations[lang] || translations['fr']).accountTypes;
  
  const translatedAccountType = (accountTypes as any)[vars.accountTypeText] || vars.accountTypeText;
  const featuresHtml = t.features.map(feature => `
    <tr>
      <td style="padding: 8px 0 8px 25px; color: #374151; font-size: 15px; position: relative;">
        <span style="position: absolute; left: 0; color: #10b981;">&#10003;</span>
        ${feature}
      </td>
    </tr>
  `).join('');
  const featuresText = t.features.map((feature, index) => `${index + 1}. ${feature}`).join('\n');
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${t.verifiedMessage} <strong>${escapeHtml(translatedAccountType)}</strong> ${t.activeMessage}</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">${t.featuresIntro}</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 25px;">
          ${featuresHtml}
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 10px 0 30px 0;">
              <a href="${vars.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.buttonText}</a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.supportText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.verifiedMessage} ${translatedAccountType} ${t.activeMessage}

${t.featuresIntro}
${featuresText}

${t.buttonText}: ${vars.loginUrl}

${t.supportText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getContractTemplate(lang: Language, vars: ContractVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).contract;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, subtitle: t.headerSubtitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.approvedMessage} <strong>${escapeHtml(vars.amount)} EUR</strong> ${t.approvedMessage2}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #1f2937; font-size: 16px;">${t.contractReadyTitle}</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${t.referenceLabel} ${escapeHtml(vars.loanId)}</p>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px;">${t.nextStepsTitle}</h3>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 10px 0 10px 30px; position: relative;">
                    <span style="position: absolute; left: 0; top: 10px; width: 20px; height: 20px; background: #10b981; color: white; border-radius: 50%; display: inline-block; text-align: center; line-height: 20px; font-size: 12px;">1</span>
                    <strong style="color: #1f2937;">${t.step1Title}</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">${t.step1Text}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 10px 30px; position: relative;">
                    <span style="position: absolute; left: 0; top: 10px; width: 20px; height: 20px; background: #10b981; color: white; border-radius: 50%; display: inline-block; text-align: center; line-height: 20px; font-size: 12px;">2</span>
                    <strong style="color: #1f2937;">${t.step2Title}</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">${t.step2Text}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 10px 30px; position: relative;">
                    <span style="position: absolute; left: 0; top: 10px; width: 20px; height: 20px; background: #10b981; color: white; border-radius: 50%; display: inline-block; text-align: center; line-height: 20px; font-size: 12px;">3</span>
                    <strong style="color: #1f2937;">${t.step3Title}</strong><br>
                    <span style="color: #6b7280; font-size: 14px;">${t.step3Text}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.downloadButton}</a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef3c7; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>${t.importantTitle}</strong> ${t.importantMessage}</p>
            </td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.accessNote}<br><br>${t.contactText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.headerTitle}

${t.approvedMessage} ${vars.amount} EUR ${t.approvedMessage2}

${t.contractReadyTitle}
${t.referenceLabel} ${vars.loanId}

${t.nextStepsTitle}
1. ${t.step1Title}: ${t.step1Text}
2. ${t.step2Title}: ${t.step2Text}
3. ${t.step3Title}: ${t.step3Text}

${t.downloadButton}: ${vars.dashboardUrl}

${t.importantTitle} ${t.importantMessage}

${t.accessNote}

${t.contactText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getFundingReleaseTemplate(lang: Language, vars: FundingReleaseVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).fundingRelease;
  const dashboardUrl = `${getEmailBaseUrl()}/dashboard`;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, subtitle: t.headerSubtitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.releaseMessage} <strong>${escapeHtml(vars.amount)} EUR</strong> ${t.releaseMessage2}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #1f2937; font-size: 16px;">${t.availabilityTitle}</p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">${t.referenceLabel} ${escapeHtml(vars.loanId)}</p>
              <p style="margin: 0; font-size: 14px; color: #374151;">${t.availabilityText}</p>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.nextStepsTitle}</h3>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step1}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step2}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step3}</td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.dashboardButton}</a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef3c7; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #92400e; font-size: 14px;">${t.reminderTitle}</p>
              <p style="margin: 0; color: #92400e; font-size: 14px;">${t.reminderText}</p>
            </td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.supportText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.headerTitle}

${t.releaseMessage} ${vars.amount} EUR ${t.releaseMessage2}

${t.referenceLabel} ${vars.loanId}
${t.availabilityText}

${t.nextStepsTitle}
- ${t.step1}
- ${t.step2}
- ${t.step3}

${t.dashboardButton}: ${dashboardUrl}

${t.reminderTitle}
${t.reminderText}

${t.supportText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getLoanRequestUserTemplate(lang: Language, vars: LoanRequestUserVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).loanRequestUser;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.confirmationMessage} <strong>${escapeHtml(vars.loanType)}</strong> ${t.confirmationMessage2} <strong>${escapeHtml(vars.amount)} EUR</strong>.</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #eff6ff; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; font-weight: bold; color: #1f2937; font-size: 16px;"><strong>${t.referenceLabel}</strong> ${escapeHtml(vars.reference)}</p>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.nextStepsTitle}</h3>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step1}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step2}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step3}</td></tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 16px; margin: 0 0 25px 0;">${t.dashboardText}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.dashboardButton}</a>
            </td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.supportText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.confirmationMessage} ${vars.loanType} ${t.confirmationMessage2} ${vars.amount} EUR.

${t.referenceLabel} ${vars.reference}

${t.nextStepsTitle}
- ${t.step1}
- ${t.step2}
- ${t.step3}

${t.dashboardText}

${t.dashboardButton}: ${vars.dashboardUrl}

${t.supportText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getLoanRequestAdminTemplate(lang: Language, vars: LoanRequestAdminVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).loanRequestAdmin;
  const accountTypes = (translations[lang] || translations["fr"]).accountTypes;
  
  const accountTypeText = vars.accountType === 'personal' ? accountTypes.personal : accountTypes.business;
  const phoneDisplay = vars.phone || 'N/A';
  
  const documentsRows = vars.documents.length > 0 
    ? vars.documents.map(doc => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">${escapeHtml(doc.documentType)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <a href="${doc.fileUrl}" style="color: #f59e0b; text-decoration: none; font-weight: 500;">${t.downloadLabel}</a>
        </td>
      </tr>
    `).join('')
    : `<tr><td colspan="2" style="padding: 12px; text-align: center; color: #6b7280;">${t.noDocuments}</td></tr>`;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #f59e0b 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.message}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.applicantLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.emailLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.email)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.phoneLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(phoneDisplay)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.accountTypeLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(accountTypeText)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.amountLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.amount)} EUR</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.durationLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${vars.duration} ${t.monthsLabel}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.loanTypeLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.loanType)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.referenceLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.reference)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.userIdLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.userId)}</td>
          </tr>
        </table>

        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.documentsTitle}</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <th style="background: #f59e0b; color: white; padding: 12px; text-align: left; font-weight: bold;">${t.documentTypeLabel}</th>
            <th style="background: #f59e0b; color: white; padding: 12px; text-align: left; font-weight: bold;">${t.downloadLabel}</th>
          </tr>
          ${documentsRows}
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.actionButton}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const documentsText = vars.documents.length > 0
    ? vars.documents.map(doc => `- ${doc.documentType}: ${doc.fileUrl}`).join('\n')
    : t.noDocuments;

  const text = `
${t.headerTitle}

${t.message}

${t.applicantLabel} ${vars.fullName}
${t.emailLabel} ${vars.email}
${t.phoneLabel} ${phoneDisplay}
${t.accountTypeLabel} ${accountTypeText}
${t.amountLabel} ${vars.amount} EUR
${t.durationLabel} ${vars.duration} ${t.monthsLabel}
${t.loanTypeLabel} ${vars.loanType}
${t.referenceLabel} ${vars.reference}
${t.userIdLabel} ${vars.userId}

${t.documentsTitle}
${documentsText}

${t.actionButton}: ${vars.reviewUrl}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getKYCUploadedAdminTemplate(lang: Language, vars: KycUploadedAdminVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).kycUploadedAdmin;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #8b5cf6 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.message}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.userLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.emailLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.email)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.documentTypeLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.documentType)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.loanTypeLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.loanType)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.userIdLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.userId)}</td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.actionButton}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.headerTitle}

${t.message}

${t.userLabel} ${vars.fullName}
${t.emailLabel} ${vars.email}
${t.documentTypeLabel} ${vars.documentType}
${t.loanTypeLabel} ${vars.loanType}
${t.userIdLabel} ${vars.userId}

${t.actionButton}: ${vars.reviewUrl}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getLoanApprovedUserTemplate(lang: Language, vars: LoanApprovedUserVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).loanApprovedUser;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, subtitle: t.headerSubtitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.approvalMessage} <strong>${escapeHtml(vars.loanType)}</strong> <strong>${escapeHtml(vars.amount)} EUR</strong> ${t.approvalMessage2}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #10b981;">
              <p style="margin: 0; font-weight: bold; color: #1f2937; font-size: 16px;"><strong>${t.referenceLabel}</strong> ${escapeHtml(vars.reference)}</p>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.nextStepsTitle}</h3>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step1}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step2}</td></tr>
                <tr><td style="padding: 5px 0 5px 20px; color: #374151; font-size: 14px;">&#8226; ${t.step3}</td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.loginButton}</a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef3c7; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>${t.importantTitle}</strong> ${t.importantMessage}</p>
            </td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.supportText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.headerTitle}
${t.headerSubtitle}

${t.approvalMessage} ${vars.loanType} ${vars.amount} EUR ${t.approvalMessage2}

${t.referenceLabel} ${vars.reference}

${t.nextStepsTitle}
- ${t.step1}
- ${t.step2}
- ${t.step3}

${t.loginButton}: ${vars.loginUrl}

${t.importantTitle} ${t.importantMessage}

${t.supportText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getTransferInitiatedAdminTemplate(lang: Language, vars: TransferInitiatedAdminVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).transferInitiatedAdmin;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #ec4899 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.message}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.userLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.emailLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.email)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.amountLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.amount)} EUR</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.recipientLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.recipient)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.transferIdLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.transferId)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.userIdLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.userId)}</td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.actionButton}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.headerTitle}

${t.message}

${t.userLabel} ${vars.fullName}
${t.emailLabel} ${vars.email}
${t.amountLabel} ${vars.amount} EUR
${t.recipientLabel} ${vars.recipient}
${t.transferIdLabel} ${vars.transferId}
${t.userIdLabel} ${vars.userId}

${t.actionButton}: ${vars.reviewUrl}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getTransferCodeUserTemplate(lang: Language, vars: TransferCodeUserVariables): EmailTemplate {
  const t = (translations[lang] || translations["fr"]).transferCodeUser;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #667eea 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #eff6ff; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937; font-size: 16px;">${t.transferInfoTitle}</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">${t.amountLabel} ${escapeHtml(vars.amount)} EUR</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${t.recipientLabel} ${escapeHtml(vars.recipient)}</p>
            </td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.instruction}</p>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8fafc; border: 2px solid #667eea; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td align="center" style="padding: 30px;">
              <p style="color: #667eea; font-size: 14px; font-weight: 600; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">${t.codeTitle}</p>
              <p style="font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0 0 10px 0;">${escapeHtml(vars.code)}</p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">${t.codeSequence} ${vars.codeSequence} ${t.codeOf} ${vars.totalCodes}</p>
              <p style="color: #666666; font-size: 14px; margin: 0;">${t.expirationText}</p>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff3cd; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-size: 14px;">${t.securityWarning}</p>
            </td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          ${t.notYouText}
        </p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting} ${vars.fullName},

${t.headerTitle}

${t.transferInfoTitle}
${t.amountLabel} ${vars.amount} EUR
${t.recipientLabel} ${vars.recipient}

${t.instruction}

${t.codeTitle}
${vars.code}
${t.codeSequence} ${vars.codeSequence} ${t.codeOf} ${vars.totalCodes}

${t.expirationText}

${t.securityWarning}

${t.notYouText}

KreditPass
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

function getTransferCompletedUserTemplate(lang: Language, vars: TransferCompletedUserVariables): EmailTemplate {
  const t = (translations as any)[lang]?.transferCompletedUser || translations.fr.transferCompletedUser;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #10b981 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-family: Arial, sans-serif;">${t.greeting} ${escapeHtml(vars.fullName)},</h2>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #d1fae5; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-size: 16px;">${t.congratulationsMessage}</p>
            </td>
          </tr>
        </table>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.summaryTitle}</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.amountLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.amount)} EUR</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.recipientLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.recipient)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.ibanLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.recipientIban)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.referenceLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.transferId)}</td>
          </tr>
        </table>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.availabilityTitle}</h3>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.availabilityMessage}</p>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.supportTitle}</h3>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">${t.supportMessage}</p>
        <p style="color: #374151; font-size: 16px; margin: 0 0 25px 0;"><strong>${t.supportEmail}</strong> ${escapeHtml(vars.supportEmail)}</p>
        
        <p style="color: #374151; font-size: 16px; margin: 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">${t.thanksMessage}</p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `${t.greeting} ${vars.fullName},

${t.congratulationsMessage}

${t.summaryTitle}
${t.amountLabel} ${vars.amount} EUR
${t.recipientLabel} ${vars.recipient}
${t.ibanLabel} ${vars.recipientIban}
${t.referenceLabel} ${vars.transferId}

${t.availabilityTitle}
${t.availabilityMessage}

${t.supportTitle}
${t.supportMessage}
${t.supportEmail} ${vars.supportEmail}

${t.thanksMessage}

KreditPass`;

  return { subject: t.subject, html, text };
}

function getTransferCompletedAdminTemplate(lang: Language, vars: TransferCompletedAdminVariables): EmailTemplate {
  const t = (translations as any)[lang]?.transferCompletedAdmin || translations.fr.transferCompletedAdmin;
  
  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #667eea 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.message}</p>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.userInfoTitle}</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.userLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.emailLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.email)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.userIdLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.userId)}</td>
          </tr>
        </table>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.transferInfoTitle}</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.amountLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.amount)} EUR</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.recipientLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.recipient)}</td>
          </tr>
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.ibanLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${escapeHtml(vars.recipientIban)}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.transferIdLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.transferId)}</td>
          </tr>
        </table>
        
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">${t.progressTitle}</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #6b7280;">${t.validationsLabel}</strong></td>
            <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${vars.totalValidations}</td>
          </tr>
          <tr>
            <td style="padding: 15px;"><strong style="color: #6b7280;">${t.completedAtLabel}</strong></td>
            <td style="padding: 15px; color: #1f2937;">${escapeHtml(vars.completedAt)}</td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 0 0 25px 0;">
              <a href="${vars.reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">${t.actionButton}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `${t.headerTitle}

${t.message}

${t.userInfoTitle}
${t.userLabel} ${vars.fullName}
${t.emailLabel} ${vars.email}
${t.userIdLabel} ${vars.userId}

${t.transferInfoTitle}
${t.amountLabel} ${vars.amount} EUR
${t.recipientLabel} ${vars.recipient}
${t.ibanLabel} ${vars.recipientIban}
${t.transferIdLabel} ${vars.transferId}

${t.progressTitle}
${t.validationsLabel} ${vars.totalValidations}
${t.completedAtLabel} ${vars.completedAt}

${t.actionButton}: ${vars.reviewUrl}

KreditPass`;

  return { subject: t.subject, html, text };
}

export function getEmailTemplate(
  templateType: TemplateType,
  language: Language,
  variables: TemplateVariables
): EmailTemplate {
  switch (templateType) {
    case 'verification':
      return getVerificationTemplate(language, variables as VerificationVariables);
    case 'welcome':
      return getWelcomeTemplate(language, variables as WelcomeVariables);
    case 'contract':
      return getContractTemplate(language, variables as ContractVariables);
    case 'fundingRelease':
      return getFundingReleaseTemplate(language, variables as FundingReleaseVariables);
    case 'otp':
      return getOtpEmailTemplate(language, variables as OtpVariables);
    case 'loanRequestUser':
      return getLoanRequestUserTemplate(language, variables as LoanRequestUserVariables);
    case 'loanRequestAdmin':
      return getLoanRequestAdminTemplate(language, variables as LoanRequestAdminVariables);
    case 'kycUploadedAdmin':
      return getKYCUploadedAdminTemplate(language, variables as KycUploadedAdminVariables);
    case 'loanApprovedUser':
      return getLoanApprovedUserTemplate(language, variables as LoanApprovedUserVariables);
    case 'transferInitiatedAdmin':
      return getTransferInitiatedAdminTemplate(language, variables as TransferInitiatedAdminVariables);
    case 'transferCodeUser':
      return getTransferCodeUserTemplate(language, variables as TransferCodeUserVariables);
    case 'transferCompletedUser':
      return getTransferCompletedUserTemplate(language, variables as TransferCompletedUserVariables);
    case 'transferCompletedAdmin':
      return getTransferCompletedAdminTemplate(language, variables as TransferCompletedAdminVariables);
    case 'transferCodesAdmin':
      return getTransferCodesAdminTemplate(language, variables as TransferCodesAdminVariables);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

export function getOtpEmailTemplate(
  language: Language,
  vars: OtpVariables
): EmailTemplate {
  const t = (translations as any)[language]?.otp || translations.fr.otp;

  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #667eea 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="font-size: 18px; color: #333333; margin: 0 0 20px 0; font-family: Arial, sans-serif;">${escapeHtml(t.greeting)} ${escapeHtml(vars.fullName)},</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${escapeHtml(t.instruction)}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8fafc; border: 2px solid #2563eb; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td align="center" style="padding: 30px;">
              <p style="color: #2563eb; font-size: 14px; font-weight: 600; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(t.codeTitle)}</p>
              <p style="font-size: 42px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0 0 15px 0;">${escapeHtml(vars.otpCode)}</p>
              <p style="color: #666666; font-size: 14px; margin: 0;">${escapeHtml(t.expirationText)}</p>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff3cd; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; font-size: 14px; margin: 0;">${escapeHtml(t.securityWarning)}</p>
            </td>
          </tr>
        </table>
        
        <p style="color: #666666; font-size: 14px; margin: 0; padding-top: 20px; border-top: 1px solid #e0e0e0;">${escapeHtml(t.notYouText)}</p>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, language);

  const text = `
${t.greeting} ${vars.fullName},

${t.headerTitle}

${t.instruction}

${t.codeTitle}: ${vars.otpCode}

${t.expirationText}

${t.securityWarning}

${t.notYouText}

KreditPass
${t.footer}
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

export function getTransferCodesAdminTemplate(
  language: Language,
  vars: TransferCodesAdminVariables
): EmailTemplate {
  const t = (translations as any)[language]?.transferCodesAdmin || translations.fr.transferCodesAdmin;

  const totalCodes = vars.codes.length;
  const codesTableRows = vars.codes
    .map(code => `
      <tr>
        <td style="padding: 12px; border: 1px solid #d1d5db; color: #374151;">${code.sequence}/${totalCodes}</td>
        <td style="padding: 12px; border: 1px solid #d1d5db;"><strong style="color: #2563eb;">${escapeHtml(code.code)}</strong></td>
        <td style="padding: 12px; border: 1px solid #d1d5db; color: #374151;">${code.pausePercent}%</td>
        <td style="padding: 12px; border: 1px solid #d1d5db; color: #374151;">${escapeHtml(code.context)}</td>
      </tr>
    `).join('');

  const emailContent = `
    ${getEmailHeader({ title: t.headerTitle, gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #c9a227 100%)' })}
    <tr>
      <td class="content-padding" style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${escapeHtml(t.message)}</p>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #eff6ff; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #2563eb;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #1f2937;">${escapeHtml(t.userLabel)}</strong> <span style="color: #374151;">${escapeHtml(vars.fullName)}</span></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #1f2937;">${escapeHtml(t.amountLabel)}</strong> <span style="color: #374151;">${escapeHtml(vars.amount)} EUR</span></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #1f2937;">${escapeHtml(t.loanIdLabel)}</strong> <span style="color: #374151;">${escapeHtml(vars.loanId)}</span></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <h2 style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 25px 0 15px 0;">${escapeHtml(t.codesTitle)}</h2>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #dbeafe; border-radius: 8px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 12px; border-left: 4px solid #3b82f6; color: #1e40af;">
              ${escapeHtml(t.codeInstruction)}
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <th style="background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold;">${escapeHtml(t.sequenceLabel)}</th>
            <th style="background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold;">Code</th>
            <th style="background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold;">${escapeHtml(t.pauseLabel)}</th>
            <th style="background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold;">${escapeHtml(t.contextLabel)}</th>
          </tr>
          ${codesTableRows}
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff3cd; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; font-weight: bold; margin: 0 0 8px 0;">${escapeHtml(t.importantTitle)}</p>
              <p style="color: #856404; font-size: 14px; margin: 0;">${escapeHtml(t.importantMessage)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, language);

  const codesTextList = vars.codes
    .map(code => `  ${code.sequence}/${totalCodes}. Code: ${code.code} - ${t.pauseLabel} ${code.pausePercent}% - ${code.context}`)
    .join('\n');

  const text = `
${t.headerTitle}

${t.message}

${t.userLabel} ${vars.fullName}
${t.amountLabel} ${vars.amount} EUR
${t.loanIdLabel} ${vars.loanId}

${t.codesTitle}

${t.codeInstruction}

${codesTextList}

${t.importantTitle}
${t.importantMessage}

KreditPass
${t.footer}
  `;

  return {
    subject: t.subject,
    html,
    text
  };
}

export function getRecognitionFeeEmailTemplate(vars: {
  userName: string;
  loanAmount: string;
  loanId: string;
  language?: string;
}): { subject: string; html: string; text: string } {
  const lang = vars.language || 'fr';

  const translations: Record<string, {
    subject: string;
    greeting: string;
    intro: string;
    feeTitle: string;
    feeExplanation: string;
    amountLabel: string;
    feeAmountLabel: string;
    loanIdLabel: string;
    nextStepTitle: string;
    nextStepDesc: string;
    ctaButton: string;
    footerNote: string;
    footer: string;
  }> = {
    fr: {
      subject: 'Action requise – Frais de reconnaissance de dette – KreditPass',
      greeting: `Madame, Monsieur ${vars.userName},`,
      intro: 'Suite à la signature de votre contrat de prêt, nous vous informons que des frais de reconnaissance de dette d\'un montant de <strong>184,00 EUR</strong> sont à régler avant le déblocage définitif des fonds.',
      feeTitle: 'Détail des frais',
      feeExplanation: 'Ces frais correspondent aux frais administratifs de traitement et de reconnaissance de dette liés à votre dossier de financement. Ils sont obligatoires pour finaliser le déblocage de votre prêt.',
      amountLabel: 'Montant du prêt :',
      feeAmountLabel: 'Frais de reconnaissance de dette :',
      loanIdLabel: 'Référence dossier :',
      nextStepTitle: 'Comment procéder ?',
      nextStepDesc: 'Pour régler ces frais et finaliser le déblocage de vos fonds, veuillez contacter notre équipe support. Nos conseillers vous accompagneront dans les démarches de paiement et répondront à toutes vos questions.',
      ctaButton: 'Contacter le support',
      footerNote: 'Le déblocage des fonds interviendra dans un délai de 24h ouvrées après réception du règlement. Notre équipe reste disponible pour vous guider.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    en: {
      subject: 'Action Required – Debt Recognition Fee – KreditPass',
      greeting: `Dear ${vars.userName},`,
      intro: 'Following the signing of your loan agreement, we inform you that a debt recognition fee of <strong>€184.00</strong> is due before the final release of funds.',
      feeTitle: 'Fee Details',
      feeExplanation: 'This fee covers the administrative processing and debt recognition costs associated with your financing file. It is required to finalise the release of your loan funds.',
      amountLabel: 'Loan Amount:',
      feeAmountLabel: 'Debt Recognition Fee:',
      loanIdLabel: 'File Reference:',
      nextStepTitle: 'How to Proceed?',
      nextStepDesc: 'To pay this fee and finalise the release of your funds, please contact our support team. Our advisors will guide you through the payment process and answer all your questions.',
      ctaButton: 'Contact Support',
      footerNote: 'Funds will be released within 24 business hours after receipt of payment. Our team is available to guide you every step of the way.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    de: {
      subject: 'Maßnahme erforderlich – Schuldanerkennungsgebühr – KreditPass',
      greeting: `Sehr geehrte/r ${vars.userName},`,
      intro: 'Nach der Unterzeichnung Ihres Darlehensvertrags teilen wir Ihnen mit, dass eine Schuldanerkennungsgebühr in Höhe von <strong>184,00 EUR</strong> vor der endgültigen Auszahlung der Mittel zu entrichten ist.',
      feeTitle: 'Gebührendetails',
      feeExplanation: 'Diese Gebühr deckt die Verwaltungskosten für die Bearbeitung und Schuldanerkennung im Zusammenhang mit Ihrer Finanzierungsakte ab.',
      amountLabel: 'Darlehensbetrag:',
      feeAmountLabel: 'Schuldanerkennungsgebühr:',
      loanIdLabel: 'Aktenreferenz:',
      nextStepTitle: 'Wie weiter vorgehen?',
      nextStepDesc: 'Um diese Gebühr zu begleichen und die Auszahlung Ihrer Mittel abzuschließen, kontaktieren Sie bitte unser Support-Team. Unsere Berater begleiten Sie durch den Zahlungsprozess.',
      ctaButton: 'Support kontaktieren',
      footerNote: 'Die Mittel werden innerhalb von 24 Werktagen nach Zahlungseingang freigegeben. Unser Team steht Ihnen jederzeit zur Verfügung.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    es: {
      subject: 'Acción requerida – Tarifa de reconocimiento de deuda – KreditPass',
      greeting: `Estimado/a ${vars.userName},`,
      intro: 'Tras la firma de su contrato de préstamo, le informamos que una tarifa de reconocimiento de deuda de <strong>184,00 EUR</strong> debe abonarse antes del desbloqueo definitivo de los fondos.',
      feeTitle: 'Detalle de la tarifa',
      feeExplanation: 'Esta tarifa cubre los costos administrativos de tramitación y reconocimiento de deuda asociados a su expediente de financiación.',
      amountLabel: 'Importe del préstamo:',
      feeAmountLabel: 'Tarifa de reconocimiento de deuda:',
      loanIdLabel: 'Referencia del expediente:',
      nextStepTitle: '¿Cómo proceder?',
      nextStepDesc: 'Para abonar esta tarifa y finalizar el desbloqueo de sus fondos, póngase en contacto con nuestro equipo de soporte. Nuestros asesores le guiarán a lo largo del proceso de pago.',
      ctaButton: 'Contactar soporte',
      footerNote: 'Los fondos se desbloquearán en un plazo de 24 horas hábiles tras la recepción del pago. Nuestro equipo está disponible para acompañarle.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    pt: {
      subject: 'Ação necessária – Taxa de reconhecimento de dívida – KreditPass',
      greeting: `Caro(a) ${vars.userName},`,
      intro: 'Após a assinatura do seu contrato de empréstimo, informamos que uma taxa de reconhecimento de dívida no valor de <strong>184,00 EUR</strong> deve ser paga antes da liberação definitiva dos fundos.',
      feeTitle: 'Detalhes da taxa',
      feeExplanation: 'Esta taxa cobre os custos administrativos de processamento e reconhecimento de dívida associados ao seu processo de financiamento.',
      amountLabel: 'Valor do empréstimo:',
      feeAmountLabel: 'Taxa de reconhecimento de dívida:',
      loanIdLabel: 'Referência do processo:',
      nextStepTitle: 'Como proceder?',
      nextStepDesc: 'Para pagar esta taxa e finalizar a liberação dos seus fundos, entre em contato com nossa equipe de suporte. Nossos consultores irão guiá-lo durante todo o processo.',
      ctaButton: 'Contatar suporte',
      footerNote: 'Os fundos serão liberados em até 24 horas úteis após o recebimento do pagamento. Nossa equipe está disponível para orientá-lo.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    it: {
      subject: 'Azione richiesta – Spese di riconoscimento del debito – KreditPass',
      greeting: `Gentile ${vars.userName},`,
      intro: 'A seguito della firma del contratto di prestito, La informiamo che è dovuta una commissione di riconoscimento del debito di <strong>184,00 EUR</strong> prima dello sblocco definitivo dei fondi.',
      feeTitle: 'Dettaglio delle spese',
      feeExplanation: 'Questa commissione copre i costi amministrativi di trattamento e riconoscimento del debito associati alla sua pratica di finanziamento.',
      amountLabel: 'Importo del prestito:',
      feeAmountLabel: 'Commissione di riconoscimento del debito:',
      loanIdLabel: 'Riferimento pratica:',
      nextStepTitle: 'Come procedere?',
      nextStepDesc: 'Per saldare questa commissione e finalizzare lo sblocco dei Suoi fondi, contatti il nostro team di supporto. I nostri consulenti La guideranno nel processo di pagamento.',
      ctaButton: 'Contatta il supporto',
      footerNote: 'I fondi verranno sbloccati entro 24 ore lavorative dal ricevimento del pagamento. Il nostro team è disponibile per supportarla.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    nl: {
      subject: 'Actie vereist – Kosten voor schulderkentenis – KreditPass',
      greeting: `Geachte ${vars.userName},`,
      intro: 'Na de ondertekening van uw leningsovereenkomst informeren wij u dat een vergoeding voor schulderkentenis van <strong>€184,00</strong> verschuldigd is vóór de definitieve vrijgave van de middelen.',
      feeTitle: 'Kostendetails',
      feeExplanation: 'Deze vergoeding dekt de administratieve verwerkings- en schulderkenteniskosten die verband houden met uw financieringsdossier.',
      amountLabel: 'Leningsbedrag:',
      feeAmountLabel: 'Kosten voor schulderkentenis:',
      loanIdLabel: 'Dossiernummer:',
      nextStepTitle: 'Hoe te handelen?',
      nextStepDesc: 'Om deze vergoeding te betalen en de vrijgave van uw middelen te voltooien, neemt u contact op met ons supportteam. Onze adviseurs begeleiden u door het betalingsproces.',
      ctaButton: 'Contact opnemen met support',
      footerNote: 'De middelen worden vrijgegeven binnen 24 werkdagen na ontvangst van de betaling. Ons team staat voor u klaar.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
    hr: {
      subject: 'Potrebna radnja – Naknade za priznanicu duga – KreditPass',
      greeting: `Poštovani/a ${vars.userName},`,
      intro: 'Nakon potpisivanja ugovora o zajmu, obavještavamo Vas da je naknada za priznanicu duga u iznosu od <strong>184,00 EUR</strong> potrebna prije konačnog isplate sredstava.',
      feeTitle: 'Detalji naknade',
      feeExplanation: 'Ova naknada pokriva administrativne troškove obrade i priznanice duga povezane s Vašim financijskim predmetom.',
      amountLabel: 'Iznos zajma:',
      feeAmountLabel: 'Naknada za priznanicu duga:',
      loanIdLabel: 'Referenca predmeta:',
      nextStepTitle: 'Kako postupiti?',
      nextStepDesc: 'Za plaćanje ove naknade i dovršetak isplate Vaših sredstava, obratite se našem timu za podršku. Naši savjetnici vodit će Vas kroz proces plaćanja.',
      ctaButton: 'Kontaktirajte podršku',
      footerNote: 'Sredstva će biti isplaćena u roku od 24 radna sata nakon primitka uplate. Naš tim je dostupan za Vašu pomoć.',
      footer: 'KreditPass – 14 Rue du Marché-aux-Herbes, L-1728 Luxembourg | support@kreditpass.org',
    },
  };

  const t = translations[lang] || translations['fr'];

  const emailContent = `
    ${getEmailHeader({ title: 'Frais de Reconnaissance de Dette', gradientColors: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #c9a227 100%)' })}
    <tr>
      <td style="padding: 40px 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${t.greeting}</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">${t.intro}</p>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #eff6ff; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px; border-left: 4px solid #2563eb;">
              <p style="font-weight: bold; color: #1e40af; margin: 0 0 12px 0; font-size: 15px;">${t.feeTitle}</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 5px 0; color: #374151;"><strong>${t.amountLabel}</strong> ${escapeHtml(vars.loanAmount)} EUR</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #dc2626;">${t.feeAmountLabel}</strong> <span style="color: #dc2626; font-weight: bold;">184,00 EUR</span></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #374151;"><strong>${t.loanIdLabel}</strong> ${escapeHtml(vars.loanId)}</td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; margin: 12px 0 0 0;">${t.feeExplanation}</p>
            </td>
          </tr>
        </table>

        <h2 style="font-size: 17px; font-weight: bold; color: #1e40af; margin: 25px 0 12px 0;">${t.nextStepTitle}</h2>
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${t.nextStepDesc}</p>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <a href="mailto:support@kreditpass.org" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">${t.ctaButton} →</a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fef3c7; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 15px; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">${t.footerNote}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${getEmailFooter(t.footer)}
  `;

  const html = getEmailWrapper(emailContent, lang);

  const text = `
${t.greeting}

${t.intro.replace(/<[^>]+>/g, '')}

${t.amountLabel} ${vars.loanAmount} EUR
${t.feeAmountLabel} 184,00 EUR
${t.loanIdLabel} ${vars.loanId}

${t.nextStepTitle}
${t.nextStepDesc}

${t.ctaButton}: support@kreditpass.org

${t.footerNote}

${t.footer}
  `;

  return { subject: t.subject, html, text };
}
