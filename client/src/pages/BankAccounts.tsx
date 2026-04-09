import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2, Trash2, Star, CreditCard, ShieldCheck, Globe } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExternalAccount } from '@shared/schema';
import { useTranslations } from '@/lib/i18n';
import { DashboardCard, SectionTitle, GradientButton } from '@/components/fintech';
import { formatIban } from '@/data/banks';
import { getRecommendedTransferNetwork, TRANSFER_TYPES, type TransferNetwork } from '@/data/transfer-types';

function BankAccountsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-2xl" />
      ))}
    </div>
  );
}

export default function BankAccounts() {
  const t = useTranslations();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    bankName: '',
    bankCountry: '',
    iban: '',
    bic: '',
    accountLabel: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: accounts, isLoading } = useQuery<ExternalAccount[]>({
    queryKey: ['/api/external-accounts'],
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/external-accounts', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-accounts'] });
      toast({
        title: t.bankAccounts.addSuccess,
        description: t.bankAccounts.addSuccessDesc,
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: t.common.error,
        description: t.bankAccounts.addError,
        variant: 'destructive',
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/external-accounts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-accounts'] });
      toast({
        title: t.bankAccounts.deleteSuccess,
        description: t.bankAccounts.deleteSuccessDesc,
      });
    },
    onError: () => {
      toast({
        title: t.common.error,
        description: t.bankAccounts.deleteError,
        variant: 'destructive',
      });
    },
  });

  const validateForm = (dataToValidate = formData) => {
    const newErrors: Record<string, string> = {};

    if (!dataToValidate.bankName.trim()) {
      newErrors.bankName = t.bankAccounts.bankNameRequired;
    }

    if (!dataToValidate.iban.trim()) {
      newErrors.iban = t.bankAccounts.ibanRequired;
    } else {
      const cleanIban = dataToValidate.iban.replace(/\s/g, '').toUpperCase();
      
      if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
        newErrors.iban = t.bankAccounts.invalidIban;
      }
    }

    if (dataToValidate.bic) {
      const cleanBic = dataToValidate.bic.replace(/\s/g, '').toUpperCase();
      if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic)) {
        newErrors.bic = t.bankAccounts.invalidBic;
      }
    }

    if (!dataToValidate.accountLabel.trim()) {
      newErrors.accountLabel = t.bankAccounts.accountLabelRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalFormData = {
      ...formData,
      iban: formData.iban.replace(/\s/g, '').toUpperCase(),
      bic: formData.bic.replace(/\s/g, '').toUpperCase(),
    };
    
    if (validateForm(finalFormData)) {
      setFormData(finalFormData);
      createAccountMutation.mutate(finalFormData);
    }
  };

  const resetForm = () => {
    setFormData({ bankName: '', bankCountry: '', iban: '', bic: '', accountLabel: '' });
    setErrors({});
  };

  const formatIBANDisplay = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const getNetworkFromIban = (iban: string): TransferNetwork => {
    // Extract country code from IBAN (first 2 characters)
    const countryCode = iban.substring(0, 2).toUpperCase();
    // Default source is Luxembourg
    const sourceCountry = 'LU';
    const network = getRecommendedTransferNetwork(sourceCountry, countryCode, 1000);
    return network;
  };

  const getNetworkBadgeColor = (network: TransferNetwork): string => {
    switch (network) {
      case 'SEPA':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'SWIFT':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'ACH':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'WIRE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'FASTER_PAYMENTS':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'INTERAC':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const handleIbanChange = (value: string) => {
    const formatted = formatIban(value);
    setFormData({ ...formData, iban: formatted });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-48" />
        <BankAccountsSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="bg-background">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <SectionTitle
              title={t.bankAccounts.title}
              subtitle={t.bankAccounts.description}
            />
            <div className="flex-shrink-0">
              <GradientButton
                variant="primary"
                icon={Plus}
                onClick={() => setDialogOpen(true)}
                data-testid="button-add-account"
              >
                {t.bankAccounts.addAccount}
              </GradientButton>
            </div>
          </div>

          {accounts && accounts.length === 0 ? (
            <DashboardCard className="bg-muted/20">
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-sm">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{t.bankAccounts.noAccountsTitle}</h3>
                <p className="text-muted-foreground text-base mb-10 max-w-md">
                  {t.bankAccounts.noAccountsDescription}
                </p>
                <GradientButton
                  variant="primary"
                  icon={Plus}
                  onClick={() => setDialogOpen(true)}
                  data-testid="button-add-first-account"
                >
                  {t.bankAccounts.addFirstAccount}
                </GradientButton>
              </div>
            </DashboardCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="list-bank-accounts">
              {accounts?.map((account) => (
                <DashboardCard 
                  key={account.id}
                  className={`relative overflow-hidden transition-all duration-200 ${
                    account.isDefault 
                      ? 'border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background' 
                      : 'hover-elevate'
                  }`}
                  testId={`card-account-${account.id}`}
                >
                  {account.isDefault && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-tl-none rounded-br-none rounded-tr-2xl gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary via-primary to-blue-600 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        {t.bankAccounts.defaultBadge}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-5 pt-2">
                      <div className="flex-shrink-0 w-18 h-18 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-sm">
                        <Building2 className="h-9 w-9 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-foreground mb-2 truncate">{account.bankName}</h3>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground truncate">{account.accountLabel}</p>
                        </div>
                        {account.bankCountry && (
                          <Badge variant="secondary" className="mt-3 text-xs">
                            {account.bankCountry}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3 p-5 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IBAN</p>
                        </div>
                        <p className="font-mono text-sm text-foreground font-medium leading-relaxed">
                          {formatIBANDisplay(account.iban)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.transferFlow.form.transferType}</p>
                        <Badge className={`text-xs px-2.5 py-1 ${getNetworkBadgeColor(getNetworkFromIban(account.iban))}`}>
                          {TRANSFER_TYPES[getNetworkFromIban(account.iban)].name}
                        </Badge>
                      </div>
                    </div>

                    {account.bic && (
                      <div className="space-y-3 p-5 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">BIC/SWIFT</p>
                        <p className="font-mono text-base text-foreground font-semibold">{account.bic}</p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-border/50 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAccountMutation.mutate(account.id)}
                        disabled={deleteAccountMutation.isPending}
                        data-testid={`button-delete-account-${account.id}`}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteAccountMutation.isPending ? t.bankAccounts.deleting : t.bankAccounts.delete}
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 sm:p-6 box-border">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold">{t.bankAccounts.addAccountTitle}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {t.bankAccounts.addAccountDescription}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="accountLabel" className="text-sm font-semibold">
                {t.bankAccounts.accountLabel}
              </Label>
              <Input
                id="accountLabel"
                value={formData.accountLabel}
                onChange={(e) => setFormData({ ...formData, accountLabel: e.target.value })}
                placeholder={t.bankAccounts.accountLabelPlaceholder}
                className="border-border/50 focus:border-primary"
                data-testid="input-account-label"
              />
              {errors.accountLabel && (
                <p className="text-sm text-destructive font-medium">{errors.accountLabel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm font-semibold">
                {t.bankAccounts.bankName}
              </Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder={t.bankAccounts.bankNamePlaceholder}
                className="border-border/50 focus:border-primary"
                data-testid="input-bank-name"
              />
              {errors.bankName && (
                <p className="text-sm text-destructive font-medium">{errors.bankName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic" className="text-sm font-semibold">
                {t.bankAccounts.bic}
                <span className="text-muted-foreground font-normal ml-1">{t.bankAccounts.optional}</span>
              </Label>
              <Input
                id="bic"
                value={formData.bic}
                onChange={(e) => setFormData({ ...formData, bic: e.target.value.toUpperCase() })}
                placeholder="BNPAFRPP"
                className="font-mono border-border/50 focus:border-primary"
                data-testid="input-bic"
              />
              {errors.bic && (
                <p className="text-sm text-destructive font-medium">{errors.bic}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban" className="text-sm font-semibold">
                {t.bankAccounts.iban}
              </Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => handleIbanChange(e.target.value)}
                placeholder="FR76 1234 5678 9012 3456 7890 123"
                className="font-mono border-border/50 focus:border-primary"
                data-testid="input-iban"
              />
              {errors.iban && (
                <p className="text-sm text-destructive font-medium">{errors.iban}</p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                data-testid="button-cancel-add-account"
                className="w-full sm:w-auto"
              >
                {t.common.cancel}
              </Button>
              <GradientButton
                variant="primary"
                type="submit"
                isLoading={createAccountMutation.isPending}
                data-testid="button-submit-add-account"
                className="w-full sm:w-auto"
              >
                {createAccountMutation.isPending ? t.common.saving : t.common.save}
              </GradientButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
