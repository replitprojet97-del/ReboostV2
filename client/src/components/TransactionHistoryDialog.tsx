import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/lib/i18n';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  description: string;
  createdAt: string;
}

export default function TransactionHistoryDialog({ open, onOpenChange }: TransactionHistoryDialogProps) {
  const t = useTranslations();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    enabled: open,
  });

  const translateDescription = (description: string): string => {
    if (description.startsWith('loan_disbursement:')) {
      const loanRef = description.split(':')[1];
      return t.transactionTypes?.loanDisbursement?.replace('{loanRef}', loanRef) || `Loan disbursement #${loanRef}`;
    }
    if (description.startsWith('transfer_completed:')) {
      const recipient = description.split(':')[1];
      return t.transactionTypes?.transferCompleted?.replace('{recipient}', recipient) || `Transfer to ${recipient}`;
    }
    if (description.startsWith('monthly_payment:')) {
      const loanRef = description.split(':')[1];
      return t.transactionTypes?.monthlyPayment?.replace('{loanRef}', loanRef) || `Monthly payment loan #${loanRef}`;
    }
    if (description.startsWith('fee_payment:')) {
      const feeType = description.split(':')[1];
      return t.transactionTypes?.feePayment?.replace('{feeType}', feeType) || `Fee: ${feeType}`;
    }
    return description;
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes('disbursement') || type.includes('deposit')) {
      return (
        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full">
          <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      );
    }
    return (
      <div className="p-2 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900 rounded-full">
        <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-[700px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 sm:p-6 box-border">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{t.dashboard.transactionHistory}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[min(500px,60vh)] pr-2 sm:pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-2 border-transparent bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:justify-between hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{translateDescription(transaction.description)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <p
                    className={`text-base sm:text-lg font-mono font-bold flex-shrink-0 self-end sm:self-auto ${
                      parseFloat(transaction.amount) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Aucune transaction disponible</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
