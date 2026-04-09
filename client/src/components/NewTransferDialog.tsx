import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Loan {
  id: string;
  loanType: string;
  amount: string;
  status: string;
  fundsAvailabilityStatus: string;
}

export default function NewTransferDialog({ open, onOpenChange }: NewTransferDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    loanId: '',
    externalAccountId: '',
  });

  const { data: availableLoans, isLoading: isLoadingLoans, refetch } = useQuery<Loan[]>({
    queryKey: ['/api/loans/available-for-transfer'],
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({ queryKey: ['/api/loans/available-for-transfer'] });
      refetch();
    }
  }, [open, queryClient, refetch]);

  const createTransferMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/transfers/initiate', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
      
      toast({
        title: t.dialogs.transfer.transferSuccess,
        description: data.message || t.dialogs.transfer.transferSuccessDesc,
      });
      
      onOpenChange(false);
      setFormData({ amount: '', recipient: '', loanId: '', externalAccountId: '' });
    },
    onError: (error: Error) => {
      toast({
        title: t.dialogs.transfer.transferError,
        description: error.message || t.dialogs.transfer.transferErrorDesc,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.loanId) {
      toast({
        title: t.dialogs.transfer.loanRequired,
        description: t.dialogs.transfer.loanRequiredDesc,
        variant: 'destructive',
      });
      return;
    }

    if (!formData.amount || formData.amount.trim() === '') {
      toast({
        title: t.dialogs.transfer.amountRequired,
        description: t.dialogs.transfer.amountRequiredDesc,
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: t.dialogs.transfer.amountInvalid,
        description: t.dialogs.transfer.amountInvalidDesc,
        variant: 'destructive',
      });
      return;
    }

    if (!formData.recipient || formData.recipient.trim() === '') {
      toast({
        title: t.dialogs.transfer.recipientRequired,
        description: t.dialogs.transfer.recipientRequiredDesc,
        variant: 'destructive',
      });
      return;
    }

    createTransferMutation.mutate(formData);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(amount));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 sm:p-6 box-border">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{t.dashboard.transferFunds}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
          {isLoadingLoans ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !availableLoans || availableLoans.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t.dialogs.transfer.noAvailableLoans}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="loanId">{t.dialogs.transfer.sourceLoan} *</Label>
                <Select
                  value={formData.loanId}
                  onValueChange={(value) => setFormData({ ...formData, loanId: value })}
                >
                  <SelectTrigger id="loanId" data-testid="select-loan">
                    <SelectValue placeholder={t.dialogs.transfer.selectLoanPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLoans.map((loan) => (
                      <SelectItem 
                        key={loan.id} 
                        value={loan.id}
                        data-testid={`option-loan-${loan.id}`}
                      >
                        {loan.loanType} - {formatCurrency(loan.amount)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">{t.dialogs.transfer.recipient} *</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder={t.dialogs.transfer.recipientPlaceholder}
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  required
                  data-testid="input-recipient"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t.dialogs.transfer.amount} (EUR) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={t.dialogs.transfer.amountPlaceholder}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  data-testid="input-amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalAccountId">{t.dialogs.transfer.externalAccount}</Label>
                <Input
                  id="externalAccountId"
                  type="text"
                  placeholder={t.dialogs.transfer.externalAccountPlaceholder}
                  value={formData.externalAccountId}
                  onChange={(e) => setFormData({ ...formData, externalAccountId: e.target.value })}
                  data-testid="input-external-account"
                />
              </div>

              <div className="bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm">
                <p className="text-muted-foreground">
                  {t.dialogs.transfer.feesDescription}
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={createTransferMutation.isPending}
                  data-testid="button-cancel"
                  className="w-full sm:w-auto"
                >
                  {t.dialogs.transfer.cancel}
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTransferMutation.isPending || !formData.loanId}
                  data-testid="button-submit-transfer"
                  className="w-full sm:w-auto"
                >
                  {createTransferMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.dialogs.transfer.creating}
                    </>
                  ) : (
                    t.dialogs.transfer.createTransfer
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
