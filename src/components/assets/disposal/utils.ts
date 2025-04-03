
export function calculateFinancialImpact(salvageValue: string, currentValue: number) {
  const salvageAmount = parseFloat(salvageValue) || 0;
  const impact = salvageAmount - currentValue;
  return {
    amount: Math.abs(impact),
    type: impact >= 0 ? "gain" : "loss",
  } as const;
}
