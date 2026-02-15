export interface CreateInvestmentRequest {
  name: string;
  initialAmount?: number | null;
  startDate?: string | null;
  description?: string | null;
}
