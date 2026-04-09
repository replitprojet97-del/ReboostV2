import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info } from 'lucide-react';
import type { TransferDetailsResponse, TransferValidationCode } from '@shared/schema';
import { useTranslations } from '@/lib/i18n';

// Helper function to translate code contexts
function translateCodeContext(codeContext: string | null | undefined, t: ReturnType<typeof useTranslations>): string {
  if (!codeContext) return t.transferFlow.progress.validationCodeLabel;
  
  // Map legacy French values to translation keys for backward compatibility
  const legacyFrenchToKeyMap: Record<string, keyof typeof t.transferFlow.progress.codeContexts> = {
    'Code de conformité réglementaire': 'regulatory_compliance',
    'Code d\'autorisation de transfert': 'transfer_authorization',
    'Code de vérification de sécurité': 'security_verification',
    'Code de déblocage de fonds': 'funds_release',
    'Code de validation finale': 'final_validation',
    'Code de frais d\'assurance': 'insurance_fee',
  };
  
  // First check if it's a legacy French value
  const mappedKey = legacyFrenchToKeyMap[codeContext];
  if (mappedKey && t.transferFlow.progress.codeContexts[mappedKey]) {
    return t.transferFlow.progress.codeContexts[mappedKey];
  }
  
  // Check if it's already a translation key
  const key = codeContext as keyof typeof t.transferFlow.progress.codeContexts;
  if (t.transferFlow.progress.codeContexts[key]) {
    return t.transferFlow.progress.codeContexts[key];
  }
  
  // Fallback to the raw value if not a known key
  return codeContext;
}

export default function TransferCodes() {
  const t = useTranslations();
  const [, params] = useRoute('/transfer/:id/codes');
  const [, setLocation] = useLocation();
  const transferId = params?.id || '';

  const { data: transferData, isLoading } = useQuery<TransferDetailsResponse>({
    queryKey: [`/api/transfers/${transferId}`],
    enabled: !!transferId,
  });

  const transfer = transferData?.transfer;
  const codes = (transferData?.codes as TransferValidationCode[]) || [];
  const sortedCodes = [...codes].sort((a, b) => a.sequence - b.sequence);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement des codes...</p>
        </div>
      </div>
    );
  }

  if (!transfer || !codes.length) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Codes introuvables</CardTitle>
            <CardDescription>
              Aucun code de validation n'a été trouvé pour ce transfert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/dashboard')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/dashboard')}
          className="mb-2"
          data-testid="button-back-dashboard"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" data-testid="alert-codes-info">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100 pl-2">
            <p className="text-sm md:text-base leading-relaxed">
              Transmettez ces codes manuellement à l'utilisateur au moment approprié. 
              Le transfert se mettra automatiquement en pause aux pourcentages indiqués.
            </p>
          </AlertDescription>
        </Alert>

        <Card data-testid="card-transfer-codes">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Codes de validation du transfert</CardTitle>
            {transfer.recipient && (
              <CardDescription className="text-sm md:text-base">
                Destinataire : {transfer.recipient} • Montant : {parseFloat(transfer.amount).toFixed(2)} EUR
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <div className="hidden md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="py-3 px-4 text-left text-sm font-semibold">Code</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Code</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Pause à</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCodes.map((code, index) => (
                      <tr 
                        key={code.id} 
                        className="border-b border-border last:border-b-0 hover-elevate"
                        data-testid={`row-code-${index + 1}`}
                      >
                        <td className="py-4 px-4 font-medium text-base" data-testid={`text-sequence-${index + 1}`}>
                          {code.sequence}/{sortedCodes.length}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-lg" data-testid={`text-code-${index + 1}`}>
                          {code.code}
                        </td>
                        <td className="py-4 px-4 font-semibold text-base" data-testid={`text-pause-${index + 1}`}>
                          {code.pausePercent}%
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground" data-testid={`text-type-${index + 1}`}>
                          {translateCodeContext(code.codeContext, t)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4 p-4">
                {sortedCodes.map((code, index) => (
                  <Card 
                    key={code.id} 
                    className="hover-elevate"
                    data-testid={`card-code-mobile-${index + 1}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Code</div>
                          <div className="font-medium text-base" data-testid={`text-sequence-mobile-${index + 1}`}>
                            {code.sequence}/{sortedCodes.length}
                          </div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Code</div>
                          <div className="font-mono font-bold text-xl" data-testid={`text-code-mobile-${index + 1}`}>
                            {code.code}
                          </div>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-xs text-muted-foreground mb-1">Pause à</div>
                          <div className="font-semibold text-base" data-testid={`text-pause-mobile-${index + 1}`}>
                            {code.pausePercent}%
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">Type</div>
                        <div className="text-sm" data-testid={`text-type-mobile-${index + 1}`}>
                          {translateCodeContext(code.codeContext, t)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note :</strong> Ces codes doivent être communiqués progressivement à l'utilisateur. 
                Chaque code sera requis lorsque le transfert atteindra le pourcentage de pause indiqué.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
