export interface InvestmentHistoryResponse {
  id: number;
  occurredAt: string; // ISO date
  changeAmount: number;
  totalValue: number;
  note?: string | null;
  sourceAccountId?: number | null;
  type: string;
}
