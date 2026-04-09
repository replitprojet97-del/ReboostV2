import { CheckCircle2, Clock, AlertCircle, XCircle, FileCheck, FileClock, FileX } from 'lucide-react';

export const LOAN_STATUS_CONFIG = {
  active: {
    icon: CheckCircle2,
    variant: 'default' as const,
    label: 'Actif',
    color: 'text-primary',
  },
  approved: {
    icon: CheckCircle2,
    variant: 'default' as const,
    label: 'Approuvé',
    color: 'text-accent',
  },
  pending_review: {
    icon: Clock,
    variant: 'secondary' as const,
    label: 'En révision',
    color: 'text-muted-foreground',
  },
  rejected: {
    icon: XCircle,
    variant: 'destructive' as const,
    label: 'Rejeté',
    color: 'text-destructive',
  },
  completed: {
    icon: CheckCircle2,
    variant: 'secondary' as const,
    label: 'Terminé',
    color: 'text-muted-foreground',
  },
} as const;

export const CONTRACT_STATUS_CONFIG = {
  awaiting_user_signature: {
    icon: FileClock,
    variant: 'destructive' as const,
    label: 'À signer',
    color: 'text-destructive',
  },
  awaiting_admin_review: {
    icon: Clock,
    variant: 'secondary' as const,
    label: 'En vérification',
    color: 'text-muted-foreground',
  },
  signed: {
    icon: FileCheck,
    variant: 'default' as const,
    label: 'Signé',
    color: 'text-accent',
  },
  rejected: {
    icon: FileX,
    variant: 'destructive' as const,
    label: 'Rejeté',
    color: 'text-destructive',
  },
} as const;

export type LoanStatus = keyof typeof LOAN_STATUS_CONFIG;
export type ContractStatus = keyof typeof CONTRACT_STATUS_CONFIG;
