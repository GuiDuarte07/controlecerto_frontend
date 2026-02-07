export interface DepositInvestmentRequest {
  investmentId: number;
  amount: number;
  accountId?: number | null;
  occurredAt?: string | null;
  note?: string | null;
}
