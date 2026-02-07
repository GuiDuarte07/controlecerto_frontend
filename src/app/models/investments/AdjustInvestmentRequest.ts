export interface AdjustInvestmentRequest {
  investmentId: number;
  newTotalValue: number;
  occurredAt?: string | null;
  note?: string | null;
}
