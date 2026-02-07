import { InvestmentHistoryResponse } from './InvestmentHistoryResponse';

export interface InfoInvestmentResponse {
  id: number;
  name: string;
  currentValue: number;
  description?: string | null;
  createdAt: string; // ISO
  updatedAt?: string | null;
  histories?: InvestmentHistoryResponse[] | null;
}
