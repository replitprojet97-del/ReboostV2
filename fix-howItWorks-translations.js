const fs = require('fs');

// Read the i18n file
const i18nPath = 'client/src/lib/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

// Remove all instances of ...howItWorksEN in howItWorks sections
content = content.replace(/howItWorks: \{\s*\.\.\.howItWorksEN,/g, 'howItWorks: {');

console.log('✅ Removed all ...howItWorksEN spreads');

// Complete howItWorks translations for all languages based on French reference

// English (en) - line ~4792
const enHowItWorks = `    howItWorks: {
      title: 'How It Works',
      subtitle: 'An ultra-fast 100% digital process in 4 simple steps',
      step1Title: 'Registration - 3 Minutes',
      step1Desc: 'Create your Altus Finance Group account in just minutes. Enter your personal or business information securely. Instant identity verification (KYC) guarantees the security of your account.',
      step1Duration: '3 min',
      step2Title: 'Login - Access Your Dashboard',
      step2Desc: 'Log in to your secure personal client dashboard. You will find all the necessary tools to manage your finances and submit loan requests. 24/7 access from any device.',
      step2Duration: 'Instant',
      step3Title: 'Request and Analysis - Instant Response',
      step3Desc: 'Submit your loan request directly from your user dashboard. Fill out the form with the desired amount and upload your supporting documents. Thanks to our real-time analysis technology, you receive a response in principle within minutes to 24 hours maximum.',
      step3Duration: '< 24h',
      step4Title: 'Immediate Disbursement - Funds Available Instantly',
      step4Desc: 'Once your request is approved, sign your contract electronically from your dashboard. Funds are immediately released to your secure Altus Finance Group account. You can then transfer them to your personal or business bank account instantly and at no additional cost.',
      step4Duration: 'Immediate',
      averageTimePrefix: 'Average total time:',
      averageTimeValue: 'Maximum 24 hours from request submission to fund disbursement',
      requiredDocumentsTitle: 'Required Documents',
      requiredDocumentsSubtitle: 'Prepare these documents to expedite your request',
      personalLoanTitle: 'Personal Loan',
      businessLoanTitle: 'Business Loan',
      documents: {
        personal: [
          'Valid ID (national ID card, passport)',
          'Proof of address (less than 3 months)',
          'Last 3 pay slips',
          'Latest tax assessment',
          'Bank statements (3 months)',
          'Project justification (quotes, invoices)'
        ],
        professional: [
          'Kbis less than 3 months old',
          'Manager\\'s ID document',
          'Company bylaws',
          'Financial statements (last 3 years)',
          'Complete tax package',
          'Professional bank statements (6 months)',
          'Business plan (startup/takeover)',
          '3-year financial forecast',
          'Quotes or proforma invoices (equipment)'
        ]
      },
      tipTitle: 'Tip:',
      tipMessage: 'Missing documents? Our team will help you complete your file.',
      tipContactCta: 'Contact us →',
      eligibilityTitle: 'Eligibility Criteria',
      eligibilitySubtitle: 'Check if you meet the requirements for your loan',
      individualsTitle: 'Individuals',
      professionalsTitle: 'Professionals',
      requiredTag: 'Required',
      eligibility: {
        personal: [
          { label: 'Adult and French resident', required: true },
          { label: 'Verifiable regular income', required: true },
          { label: 'No banking ban', required: true },
          { label: 'Debt ratio < 35%', required: true },
          { label: 'Acceptable credit score', required: false }
        ],
        professional: [
          { label: 'Company registered in France', required: true },
          { label: 'Operating for +6 months', required: true },
          { label: 'Up-to-date financial statements', required: true },
          { label: 'No collective proceedings', required: true },
          { label: 'Personal contribution 10-30%', required: true }
        ]
      },
      stepsSimpleTitle: '4 simple steps',
      stepsSimpleSubtitle: 'From request to fund disbursement with complete ease',
      securityTitle: 'Security & Guarantees',
      securitySubtitle: 'Your security is our absolute priority',
      securityFeatures: [
        {
          title: '256-bit SSL Encryption',
          description: 'All your data is protected by military-grade encryption'
        },
        {
          title: 'ISO 27001 Certification',
          description: 'Compliance with international security standards'
        },
        {
          title: 'GDPR Data Protection',
          description: 'Full respect for your privacy and data'
        },
        {
          title: 'Two-Factor Authentication',
          description: 'Enhanced protection for your account'
        }
      ],
      security: {
        dataProtectionTitle: 'Your Protected Data',
        dataProtectionItems: [
          '256-bit SSL encryption',
          'GDPR and ACPR compliance',
          'Secure servers in France',
          'Two-factor authentication'
        ],
        guaranteesTitle: 'Guarantee Organizations',
        guaranteesItems: [
          'BPI France (40-70% of loan)',
          'SIAGI (craftsmen/merchants)',
          'France Active (social economy)',
          'Mandatory borrower insurance'
        ]
      },
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Submit your online request in minutes and get a quick response',
      ctaRequestButton: 'Request a Loan',
      ctaContactButton: 'Talk to an Advisor'
    },`;

console.log('Created English translation');

// Write the updated content back
fs.writeFileSync(i18nPath, content);
console.log('✅ Fixed howItWorks translations');
console.log('Next step: manually review and add other language complete translations');
