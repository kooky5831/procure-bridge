
export type Currency = 'USD' | 'GBP' | 'ETB' | 'KES' | 'AED' | 'ZAR';

export type WorkflowRule = {
  id: string;
  name: string;
  description: string;
  category: string;
  costRange: {
    min: number;
    max: number;
    currency: Currency;
  };
  status: 'live' | 'draft';
  approvalSteps: {
    order: number;
    role: string;
    requiredLevel?: 'ANY' | 'ALL';
  }[];
};

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';

export type WorkflowInstance = {
  id: string;
  requestId: string;
  requestTitle: string;
  amount: number;
  currency: Currency;
  category: string;
  currentStep: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt: Date;
  approvalSteps: {
    order: number;
    role: string;
    status: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    comments?: string;
  }[];
};

export function findMatchingWorkflowRule(
  rules: WorkflowRule[],
  params: {
    category: string;
    totalCost: number;
    currency: Currency;
  }
): WorkflowRule | null {
  // Only consider 'live' rules
  const activeRules = rules.filter(rule => rule.status === 'live');
  
  return activeRules.find(rule => 
    rule.category === params.category &&
    rule.costRange.currency === params.currency &&
    params.totalCost >= rule.costRange.min &&
    params.totalCost <= rule.costRange.max
  ) || null;
}
