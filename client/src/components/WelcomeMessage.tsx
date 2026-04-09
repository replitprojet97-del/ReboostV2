import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Info, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useUser, getAccountTypeLabel } from '@/hooks/use-user';
import { useTranslations } from '@/lib/i18n';

export default function WelcomeMessage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (user && !user.hasSeenWelcomeMessage) {
      setIsOpen(true);
    }
  }, [user]);

  const markAsSeenMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/mark-welcome-seen', {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Failed to mark welcome message as seen:', error);
      setIsOpen(false);
    },
  });

  const handleClose = (open: boolean) => {
    if (!open && !markAsSeenMutation.isPending) {
      markAsSeenMutation.mutate();
    }
  };

  if (!user) return null;

  const accountType = user.accountType === 'business' ? 'business' : 'individual';
  const accountTypeLabel = getAccountTypeLabel(user.accountType);
  const isIndividual = accountType === 'individual';

  const availableOffers = isIndividual 
    ? t.dashboard.welcome.offers.individual 
    : t.dashboard.welcome.offers.business;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[600px] max-h-[90vh] flex flex-col p-3 sm:p-6 gap-0 box-border overflow-x-hidden" data-testid="dialog-welcome-message">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <DialogTitle className="text-lg sm:text-2xl leading-tight">
              {t.dashboard.welcome.dialog.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            {t.dashboard.welcome.dialog.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 overflow-y-auto flex-1 min-h-0">
          <Alert className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-xs sm:text-sm ml-2">
              <strong>{t.dashboard.welcome.account.badgeLabel} {accountTypeLabel}</strong>
              <p className="mt-1 sm:mt-2">
                {isIndividual
                  ? t.dashboard.welcome.account.individual.description
                  : t.dashboard.welcome.account.business.description}
              </p>
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              {t.dashboard.welcome.offers.title}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {availableOffers.map((offer, index) => (
                <li key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </div>

          <Alert variant="default" className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <AlertDescription className="text-xs sm:text-sm">
              <strong>{t.dashboard.welcome.important.title}</strong> {t.dashboard.welcome.important.message}
              {isIndividual
                ? t.dashboard.welcome.important.individualSwitch
                : t.dashboard.welcome.important.businessSwitch}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            onClick={() => handleClose(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={markAsSeenMutation.isPending}
            data-testid="button-close-welcome"
          >
            {markAsSeenMutation.isPending ? t.dashboard.welcome.cta.pending : t.dashboard.welcome.cta.primary}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
