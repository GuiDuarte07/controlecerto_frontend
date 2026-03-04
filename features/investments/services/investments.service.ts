import { api } from "@/lib/api/client";
import type {
  AdjustInvestmentRequest,
  CreateInvestmentRequest,
  DepositInvestmentRequest,
  InfoInvestmentResponse,
  InvestmentHistoryResponse,
  UpdateInvestmentRequest,
} from "@/types";

const BASE = "/Investment";

export const investmentService = {
  getInvestments: () =>
    api.get<InfoInvestmentResponse[]>(`${BASE}/GetInvestments`),

  getInvestmentById: (id: number) =>
    api.get<InfoInvestmentResponse>(`${BASE}/GetInvestment/${id}`),

  getInvestmentHistory: (investmentId: number) =>
    api.get<InvestmentHistoryResponse[]>(
      `${BASE}/GetInvestmentHistory/${investmentId}`
    ),

  createInvestment: (data: CreateInvestmentRequest) =>
    api.post<InfoInvestmentResponse>(`${BASE}/CreateInvestment`, data),

  updateInvestment: (data: UpdateInvestmentRequest) =>
    api.patch<unknown>(`${BASE}/UpdateInvestment`, data),

  deposit: (data: DepositInvestmentRequest) =>
    api.post<InfoInvestmentResponse>(`${BASE}/Deposit`, data),

  withdraw: (data: DepositInvestmentRequest) =>
    api.post<InfoInvestmentResponse>(`${BASE}/Withdraw`, data),

  adjustValue: (data: AdjustInvestmentRequest) =>
    api.post<InfoInvestmentResponse>(`${BASE}/AdjustValue`, data),

  deleteInvestment: (id: number) =>
    api.delete<void>(`${BASE}/DeleteInvestment/${id}`),
};
