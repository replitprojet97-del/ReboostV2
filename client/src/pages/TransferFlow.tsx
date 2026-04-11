import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/queryClient';
import {
  ArrowLeft, CheckCircle2, Send, Shield, Loader2, Building2,
  Lock, Clock, Globe, Mail, AlertCircle, ChevronRight, Download,
  ArrowDown, Banknote
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SuccessAnimation from '@/components/SuccessAnimation';
import type { TransferDetailsResponse, ExternalAccount } from '@shared/schema';
import { getTransferReferenceNumber } from '@shared/schema';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { translateBackendMessage } from '@/lib/translateBackendMessage';

type Step = 'form' | 'processing' | 'complete';

interface ActiveTransferResponse {
  hasActiveTransfer: boolean;
  transfer?: { id: string; status: string; amount: string; recipient: string };
}

interface AvailableLoan {
  id: string;
  amount: string;
  loanType: string;
  status: string;
  fundsAvailabilityStatus: string;
}

function TransferTimeline({ activeStep, t }: {
  activeStep: 1 | 2 | 3;
  t: ReturnType<typeof useTranslations>;
}) {
  const steps = [
    t.transferFlow.processing.timelineStep1,
    t.transferFlow.processing.timelineStep2,
    t.transferFlow.processing.timelineStep3,
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < activeStep;
        const isActive = stepNum === activeStep;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? 'bg-blue-600 border-blue-600'
                  : isActive
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : isActive ? (
                  <span className="text-white text-sm font-bold">{stepNum}</span>
                ) : (
                  <span className="text-gray-400 text-sm font-medium">{stepNum}</span>
                )}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${
                isCompleted || isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
              }`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mb-5 mx-1 ${
                stepNum < activeStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value, highlight, mono, badge }: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <span className={`text-sm ${
          highlight
            ? 'text-blue-700 dark:text-blue-300 font-bold text-xl'
            : 'font-medium text-gray-900 dark:text-white'
        } ${mono ? 'font-mono text-xs tracking-wide' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default function TransferFlow() {
  const [, params] = useRoute<{ id: string }>('/transfer/:id');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const t = useTranslations();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>('form');
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [externalAccountId, setExternalAccountId] = useState('');
  const [useNewAccount, setUseNewAccount] = useState(false);
  const [newIban, setNewIban] = useState('');
  const [newBic, setNewBic] = useState('');
  const [newAccountLabel, setNewAccountLabel] = useState('');
  const [transferId, setTransferId] = useState<string>('');
  const [isLoadingExistingTransfer, setIsLoadingExistingTransfer] = useState(false);
  const [isCheckingActive, setIsCheckingActive] = useState(true);

  const isRealTransferId = (id?: string) => !!id && id !== 'new';

  const { data: externalAccounts = [] } = useQuery<ExternalAccount[]>({
    queryKey: ['/api/external-accounts'],
  });

  const { data: availableLoans = [], isLoading: isLoadingLoans } = useQuery<AvailableLoan[]>({
    queryKey: ['/api/loans/available-for-transfer'],
  });

  const { data: activeTransferData, isLoading: isLoadingActiveTransfer } = useQuery<ActiveTransferResponse>({
    queryKey: ['/api/transfers/active'],
    enabled: !isRealTransferId(params?.id),
  });

  const { data: transferData, isLoading: isLoadingTransferData } = useQuery<TransferDetailsResponse>({
    queryKey: [`/api/transfers/${transferId}`],
    enabled: isRealTransferId(transferId),
  });

  useEffect(() => {
    if (isRealTransferId(params?.id)) {
      setTransferId(params!.id);
      setIsLoadingExistingTransfer(true);
      setIsCheckingActive(false);
    } else if (params?.id === 'new') {
      setStep('form');
      setIsCheckingActive(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (isRealTransferId(params?.id)) return;
    if (isLoadingActiveTransfer) return;
    if (activeTransferData?.hasActiveTransfer && activeTransferData.transfer) {
      setLocation(`/transfer/${activeTransferData.transfer.id}`);
    } else {
      setIsCheckingActive(false);
    }
  }, [isLoadingActiveTransfer, activeTransferData, params?.id]);

  useEffect(() => {
    if (!isRealTransferId(transferId)) return;
    if (isLoadingTransferData) return;
    setIsLoadingExistingTransfer(false);
    if (!transferData?.transfer) {
      setLocation('/transfer/new');
      return;
    }
    const tr = transferData.transfer;
    if (tr.status === 'completed') {
      setStep('complete');
    } else {
      setStep('processing');
    }
  }, [transferId, transferData, isLoadingTransferData]);

  useEffect(() => {
    if (availableLoans.length === 1 && !selectedLoanId) {
      setSelectedLoanId(availableLoans[0].id);
    }
  }, [availableLoans]);

  useEffect(() => {
    if (externalAccounts.length === 0) {
      setUseNewAccount(true);
    }
  }, [externalAccounts]);

  const selectedLoan = availableLoans.find(l => l.id === selectedLoanId);
  const amount = selectedLoan?.amount || '';

  const initiateMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      recipient: string;
      loanId: string;
      externalAccountId: string;
      transferNetwork: string;
      networkFees: number;
      processingTime: string;
    }) => {
      const csrfRes = await fetch(getApiUrl('/api/csrf-token'), { credentials: 'include' });
      if (!csrfRes.ok) throw new Error('SESSION_EXPIRED');
      const { csrfToken } = await csrfRes.json();
      if (!csrfToken) throw new Error('SESSION_EXPIRED');
      const response = await fetch(getApiUrl('/api/transfers/initiate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to initiate transfer');
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/transfers/active'] });
      if (data.redirect && data.existingTransferId) {
        setLocation(`/transfer/${data.existingTransferId}`);
        return;
      }
      const id = data.transfer?.id || data.id;
      setTransferId(id);
      setStep('processing');
      setLocation(`/transfer/${id}`);
    },
    onError: (error: Error) => {
      if (error.message === 'SESSION_EXPIRED') {
        toast({
          variant: 'destructive',
          title: 'Session expirée',
          description: 'Veuillez vous reconnecter.',
        });
        setTimeout(() => { window.location.href = '/login'; }, 2000);
        return;
      }
      toast({
        variant: 'destructive',
        title: t.transferFlow.toast.error,
        description: translateBackendMessage(error.message, language) || t.transferFlow.toast.errorInitiation,
      });
    },
  });

  const handleSubmit = async () => {
    if (!selectedLoan) {
      toast({ variant: 'destructive', title: t.transferFlow.toast.noActiveLoan, description: t.transferFlow.alerts.noLoansDescription });
      return;
    }
    if (!recipient.trim()) {
      toast({ variant: 'destructive', title: t.transferFlow.toast.fieldsRequired, description: t.transferFlow.toast.fieldsRequiredDesc });
      return;
    }

    let accountId = externalAccountId;

    if (useNewAccount || !externalAccountId) {
      if (!newIban.trim() || !newBic.trim()) {
        toast({ variant: 'destructive', title: t.transferFlow.toast.fieldsRequired, description: t.transferFlow.toast.fieldsRequiredDesc });
        return;
      }
      try {
        const csrfRes = await fetch(getApiUrl('/api/csrf-token'), { credentials: 'include' });
        const { csrfToken } = await csrfRes.json();
        const accountRes = await fetch(getApiUrl('/api/external-accounts'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
          credentials: 'include',
          body: JSON.stringify({
            iban: newIban.trim().replace(/\s/g, ''),
            bic: newBic.trim().toUpperCase(),
            accountLabel: newAccountLabel.trim() || recipient.trim(),
            bankName: recipient.trim(),
            isDefault: false,
          }),
        });
        if (!accountRes.ok) {
          const err = await accountRes.json();
          toast({ variant: 'destructive', title: t.transferFlow.toast.error, description: err.error || 'Échec de l\'enregistrement du compte' });
          return;
        }
        const newAccount = await accountRes.json();
        accountId = newAccount.id;
        queryClient.invalidateQueries({ queryKey: ['/api/external-accounts'] });
      } catch {
        toast({ variant: 'destructive', title: t.transferFlow.toast.error, description: 'Échec de l\'enregistrement du compte' });
        return;
      }
    }

    initiateMutation.mutate({
      amount: parseFloat(amount),
      recipient: recipient.trim(),
      loanId: selectedLoan.id,
      externalAccountId: accountId,
      transferNetwork: 'SEPA',
      networkFees: 0,
      processingTime: '1-3 business days',
    });
  };

  const isLoading =
    isCheckingActive ||
    isLoadingActiveTransfer ||
    isLoadingExistingTransfer ||
    (isRealTransferId(transferId) && step === 'form');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">{t.transferFlow.form.initiating}</p>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    const tr = transferData?.transfer;
    const refNum = tr ? getTransferReferenceNumber(tr as any) : '—';
    return (
      <ProcessingStep
        t={t}
        transfer={tr as any}
        refNum={refNum}
        amount={amount || (tr?.amount as string) || ''}
        recipient={recipient || (tr?.recipient as string) || ''}
        onBack={() => setLocation('/dashboard')}
      />
    );
  }

  if (step === 'complete') {
    const tr = transferData?.transfer;
    const refNum = tr ? getTransferReferenceNumber(tr as any) : '—';
    return <CompleteStep t={t} transfer={tr as any} refNum={refNum} onBack={() => setLocation('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => setLocation('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
          data-testid="button-back-dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{t.transferFlow.backToDashboard}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-white">{t.transferFlow.form.title}</h1>
                      <p className="text-blue-100 text-sm">{t.transferFlow.form.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full">
                    {t.transferFlow.form.networkSEPA}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {availableLoans.length === 0 && !isLoadingLoans && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{t.transferFlow.alerts.noLoansDescription}</AlertDescription>
                  </Alert>
                )}

                {availableLoans.length > 1 && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.transferFlow.form.amountLabel}
                    </Label>
                    <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                      <SelectTrigger data-testid="select-loan" className="h-11">
                        <SelectValue placeholder={t.transferFlow.form.selectAccountPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLoans.map(loan => (
                          <SelectItem key={loan.id} value={loan.id}>
                            {parseFloat(loan.amount).toLocaleString('fr-FR')} EUR — {loan.loanType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                        <Banknote className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t.transferFlow.form.fromLabel}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{t.transferFlow.progress.senderValue}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">KreditPass</span>
                    {selectedLoan ? (
                      <span className="text-2xl font-bold text-blue-700 dark:text-blue-300" data-testid="text-transfer-amount">
                        {parseFloat(amount).toLocaleString('fr-FR')} EUR
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500 italic">—</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 px-4">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                    <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                      <ArrowDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  </div>

                  <div className="px-4 py-4 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="recipient" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t.transferFlow.form.recipientLabel} *
                      </Label>
                      <Input
                        id="recipient"
                        data-testid="input-recipient"
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                        placeholder={t.transferFlow.form.recipientPlaceholder}
                        className="h-11 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t.transferFlow.form.beneficiaryAccountLabel}
                      </Label>

                      {externalAccounts.length > 0 && (
                        <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <button
                            onClick={() => setUseNewAccount(false)}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                              !useNewAccount
                                ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                            data-testid="button-use-existing-account"
                          >
                            {t.transferFlow.form.useExistingAccount}
                          </button>
                          <button
                            onClick={() => { setUseNewAccount(true); setExternalAccountId(''); }}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                              useNewAccount
                                ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                            data-testid="button-add-new-account"
                          >
                            + {t.transferFlow.form.addNewAccount}
                          </button>
                        </div>
                      )}

                      {!useNewAccount && externalAccounts.length > 0 && (
                        <Select value={externalAccountId} onValueChange={setExternalAccountId}>
                          <SelectTrigger data-testid="select-external-account" className="h-11">
                            <SelectValue placeholder={t.transferFlow.form.selectAccountPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {externalAccounts.map(acc => (
                              <SelectItem key={acc.id} value={acc.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{acc.accountLabel || acc.bankName}</span>
                                  <span className="text-gray-400 text-xs font-mono">{acc.iban?.slice(-8)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {(useNewAccount || externalAccounts.length === 0) && (
                        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600">
                          <div className="space-y-1.5">
                            <Label htmlFor="new-iban" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {t.transferFlow.form.ibanLabel} *
                            </Label>
                            <Input
                              id="new-iban"
                              data-testid="input-iban"
                              value={newIban}
                              onChange={e => setNewIban(e.target.value.toUpperCase())}
                              placeholder={t.transferFlow.form.ibanPlaceholder}
                              className="h-10 font-mono text-sm tracking-widest"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="new-bic" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {t.transferFlow.form.bicLabel} *
                              </Label>
                              <Input
                                id="new-bic"
                                data-testid="input-bic"
                                value={newBic}
                                onChange={e => setNewBic(e.target.value.toUpperCase())}
                                placeholder={t.transferFlow.form.bicPlaceholder}
                                className="h-10 font-mono text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="new-account-label" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {t.transferFlow.form.accountNameLabel}
                              </Label>
                              <Input
                                id="new-account-label"
                                data-testid="input-account-label"
                                value={newAccountLabel}
                                onChange={e => setNewAccountLabel(e.target.value)}
                                placeholder={t.transferFlow.form.accountNamePlaceholder}
                                className="h-10 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-xs">
                  <div className="flex-1 flex flex-col items-center py-2.5 px-3 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700">
                    <span className="text-gray-400 dark:text-gray-500 mb-0.5">{t.transferFlow.form.summaryTitle}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{t.transferFlow.form.networkSEPA}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2.5 px-3 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700">
                    <span className="text-gray-400 dark:text-gray-500 mb-0.5">{t.transferFlow.complete.feesLabel}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{t.transferFlow.form.feesFreeLabel}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2.5 px-3 bg-gray-50 dark:bg-gray-700/50">
                    <span className="text-gray-400 dark:text-gray-500 mb-0.5">{t.transferFlow.security.processingTimeTitle}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">1–3j</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={initiateMutation.isPending || !selectedLoan}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                  data-testid="button-submit-transfer"
                >
                  {initiateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t.transferFlow.form.initiating}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t.transferFlow.form.initiateButton}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                {t.transferFlow.security.title}
              </h3>
              <div className="space-y-4">
                {([
                  { icon: Lock, title: t.transferFlow.security.sepaSecureTitle, desc: t.transferFlow.security.sepaSecureDesc },
                  { icon: Globe, title: t.transferFlow.security.kycAmlTitle, desc: t.transferFlow.security.kycAmlDesc },
                  { icon: Clock, title: t.transferFlow.security.processingTimeTitle, desc: t.transferFlow.security.processingTimeDesc },
                ] as const).map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mb-1">{t.transferFlow.security.securityCodesTitle}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">{t.transferFlow.security.securityCodesDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessingStep({ t, transfer, refNum, amount, recipient, onBack }: {
  t: ReturnType<typeof useTranslations>;
  transfer: any;
  refNum: string;
  amount: string;
  recipient: string;
  onBack: () => void;
}) {
  const displayAmount = transfer?.amount || amount;
  const displayRecipient = transfer?.recipient || recipient;
  const iban = transfer?.externalAccount?.iban || '';
  const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto px-4 py-10">
        <TransferTimeline activeStep={2} t={t} />

        <div className="flex items-center justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 dark:border-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {t.transferFlow.processing.statusBadge}
          </span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.transferFlow.processing.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.transferFlow.processing.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.transferFlow.processing.detailsTitle}</h2>
          </div>
          <div className="px-5">
            <DetailRow
              label={t.transferFlow.processing.amountLabel}
              value={`${parseFloat(displayAmount || '0').toLocaleString('fr-FR')} EUR`}
              highlight
            />
            {displayRecipient && (
              <DetailRow label={t.transferFlow.processing.recipientLabel} value={displayRecipient} />
            )}
            {iban && (
              <DetailRow label={t.transferFlow.processing.ibanLabel} value={iban} mono />
            )}
            <DetailRow label={t.transferFlow.processing.referenceLabel} value={refNum} mono />
            <DetailRow label={t.transferFlow.complete.dateLabel} value={now} />
            <DetailRow
              label={t.transferFlow.complete.feesLabel}
              value="0,00 EUR"
              badge={t.transferFlow.form.feesFreeLabel}
            />
            <DetailRow label={t.transferFlow.form.summaryTitle} value={t.transferFlow.form.networkSEPA} />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-5 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1.5">{t.transferFlow.processing.contactTitle}</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">{t.transferFlow.processing.contactDesc}</p>
          <a
            href="mailto:support@kreditpass.org"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            data-testid="button-contact-support"
          >
            <Mail className="h-4 w-4" />
            {t.transferFlow.processing.contactButton}
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-4">{t.transferFlow.processing.description}</p>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full rounded-xl"
          data-testid="button-return-dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.transferFlow.processing.returnButton}
        </Button>
      </div>
    </div>
  );
}

function CompleteStep({ t, transfer, refNum, onBack }: {
  t: ReturnType<typeof useTranslations>;
  transfer: any;
  refNum: string;
  onBack: () => void;
}) {
  const amount = transfer?.amount || '';
  const recipient = transfer?.recipient || '';
  const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto px-4 py-10">
        <TransferTimeline activeStep={3} t={t} />

        <div className="text-center mb-6">
          <SuccessAnimation />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{t.transferFlow.complete.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.transferFlow.complete.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t.transferFlow.processing.detailsTitle}</h2>
          </div>
          <div className="px-5">
            {amount && (
              <DetailRow
                label={t.transferFlow.complete.amountLabel}
                value={`${parseFloat(amount).toLocaleString('fr-FR')} EUR`}
                highlight
              />
            )}
            {recipient && (
              <DetailRow label={t.transferFlow.complete.recipientLabel} value={recipient} />
            )}
            <DetailRow label={t.transferFlow.complete.referenceLabel} value={refNum} mono />
            <DetailRow
              label={t.transferFlow.complete.statusLabel}
              value={t.transferFlow.progress.statusCompleted}
              badge="✓"
            />
            <DetailRow label={t.transferFlow.complete.dateLabel} value={now} />
            <DetailRow
              label={t.transferFlow.complete.feesLabel}
              value="0,00 EUR"
              badge={t.transferFlow.form.feesFreeLabel}
            />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-5">
          <p className="text-sm text-green-800 dark:text-green-300">{t.transferFlow.complete.confirmationEmail}</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            data-testid="button-download-receipt"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            {t.transferFlow.complete.downloadButton}
          </Button>
          <Button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            data-testid="button-return-dashboard-complete"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.transferFlow.complete.returnButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
