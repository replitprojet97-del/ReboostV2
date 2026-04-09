import { createContext, useContext, useState, ReactNode } from 'react';
import NewLoanDialog from '@/components/NewLoanDialog';

interface LoanDialogContextType {
  openDialog: () => void;
  closeDialog: () => void;
  isOpen: boolean;
}

const LoanDialogContext = createContext<LoanDialogContextType | undefined>(undefined);

export function LoanDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <LoanDialogContext.Provider value={{ openDialog, closeDialog, isOpen }}>
      {children}
      <NewLoanDialog open={isOpen} onOpenChange={setIsOpen} />
    </LoanDialogContext.Provider>
  );
}

export function useLoanDialog() {
  const context = useContext(LoanDialogContext);
  if (context === undefined) {
    throw new Error('useLoanDialog must be used within a LoanDialogProvider');
  }
  return context;
}
