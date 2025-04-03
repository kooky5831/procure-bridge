
export interface DisposalDialogProps {
  assetId: string;
  assetName: string;
  currentValue: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisposalComplete?: () => void;
}

export interface FinancialImpact {
  amount: number;
  type: 'gain' | 'loss';
}
