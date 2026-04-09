import { useUser } from '@/hooks/use-user';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Suspension reasons translations
const SUSPENSION_REASONS: Record<string, Record<string, string>> = {
  en: {
    suspicious_activity: 'Suspicious activity detected',
    policy_violation: 'Violation of platform policy',
    fraud_investigation: 'Fraud investigation in progress',
    compliance_issue: 'Compliance verification required',
    verification_failed: 'Verification failed',
    payment_issue: 'Payment or transaction issue',
    security_breach: 'Security breach detected',
  },
  fr: {
    suspicious_activity: 'Activité suspecte détectée',
    policy_violation: 'Violation de la politique de la plateforme',
    fraud_investigation: 'Enquête de fraude en cours',
    compliance_issue: 'Vérification de conformité requise',
    verification_failed: 'Vérification échouée',
    payment_issue: 'Problème de paiement ou de transaction',
    security_breach: 'Brèche de sécurité détectée',
  },
  es: {
    suspicious_activity: 'Actividad sospechosa detectada',
    policy_violation: 'Violación de la política de la plataforma',
    fraud_investigation: 'Investigación de fraude en curso',
    compliance_issue: 'Verificación de cumplimiento requerida',
    verification_failed: 'Verificación fallida',
    payment_issue: 'Problema de pago o transacción',
    security_breach: 'Violación de seguridad detectada',
  },
  pt: {
    suspicious_activity: 'Atividade suspeita detectada',
    policy_violation: 'Violação da política da plataforma',
    fraud_investigation: 'Investigação de fraude em andamento',
    compliance_issue: 'Verificação de conformidade necessária',
    verification_failed: 'Verificação falhou',
    payment_issue: 'Problema de pagamento ou transação',
    security_breach: 'Violação de segurança detectada',
  },
  it: {
    suspicious_activity: 'Attività sospetta rilevata',
    policy_violation: 'Violazione della politica della piattaforma',
    fraud_investigation: 'Indagine su frode in corso',
    compliance_issue: 'Verifica di conformità richiesta',
    verification_failed: 'Verifica non riuscita',
    payment_issue: 'Problema di pagamento o transazione',
    security_breach: 'Violazione di sicurezza rilevata',
  },
  de: {
    suspicious_activity: 'Verdächtige Aktivität erkannt',
    policy_violation: 'Verstoß gegen die Plattformrichtlinie',
    fraud_investigation: 'Betrugsprüfung läuft',
    compliance_issue: 'Compliance-Überprüfung erforderlich',
    verification_failed: 'Überprüfung fehlgeschlagen',
    payment_issue: 'Zahlungs- oder Transaktionsproblem',
    security_breach: 'Sicherheitsverletzung erkannt',
  },
  nl: {
    suspicious_activity: 'Verdachte activiteit gedetecteerd',
    policy_violation: 'Schending van platformbeleid',
    fraud_investigation: 'Fraudeonderzoek gaande',
    compliance_issue: 'Nalevingscontrole vereist',
    verification_failed: 'Verificatie mislukt',
    payment_issue: 'Betaling- of transactieprobleem',
    security_breach: 'Beveiligingsinbreuk gedetecteerd',
  },
};

function translateSuspensionReason(reason: string, language: string): string {
  const lowerReason = reason.toLowerCase();
  
  // Try exact match first
  for (const [key, value] of Object.entries(SUSPENSION_REASONS[language] || {})) {
    if (lowerReason === key) {
      return value;
    }
  }
  
  // Try partial match (if reason contains the key)
  for (const [key, value] of Object.entries(SUSPENSION_REASONS[language] || {})) {
    if (lowerReason.includes(key.replace(/_/g, ' ')) || lowerReason.includes(key)) {
      return value;
    }
  }
  
  // Return original reason if no translation found
  return reason;
}

export default function SuspendedUser() {
  const { data: user } = useUser();
  const [, setLocation] = useLocation();
  const t = useTranslations();
  const { language } = useLanguage();

  useEffect(() => {
    if (user && user.status !== 'suspended') {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setLocation('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      setLocation('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <AlertTriangle className="w-8 h-8 text-destructive" data-testid="icon-suspended" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2" data-testid="text-suspended-title">
            {t.suspended?.title || 'Account Suspended'}
          </h1>

          <p className="text-center text-muted-foreground mb-6" data-testid="text-suspended-message">
            {t.suspended?.message || 'Your account has been suspended and is currently unavailable.'}
          </p>

          {user?.suspensionReason && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">{t.suspended?.reason || 'Reason'}:</p>
              <p className="text-sm text-muted-foreground" data-testid="text-suspension-reason">
                {translateSuspensionReason(user.suspensionReason, language)}
              </p>
            </div>
          )}

          {user?.suspendedUntil && (
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">{t.suspended?.until || 'Suspension until'}:</p>
              <p className="text-sm text-muted-foreground" data-testid="text-suspension-date">
                {new Date(user.suspendedUntil).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center mb-8">
            {t.suspended?.contact || 'If you believe this is a mistake or have questions, please contact our support team.'}
          </p>

          <Button
            onClick={handleLogout}
            className="w-full gap-2"
            variant="default"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            {t.suspended?.signOut || 'Sign Out'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
