import { api } from "@/lib/api/client";
import type {
  CreateTransactionRequest,
  CreateTransferenceRequest,
  InfoTransferenceResponse,
  TransactionListResponse,
  UpdateTransactionRequest,
  TransactionFilters,
} from "@/types";
import { getMonthRange } from "@/lib/utils/format";

const BASE = "/Transaction";

export const transactionService = {
  getTransactions: (filters?: TransactionFilters) => {
    const defaultRange = getMonthRange();
    return api.get<TransactionListResponse>(`${BASE}/GetTransactions`, {
      startDate: filters?.startDate || defaultRange.startDate,
      endDate: filters?.endDate || defaultRange.endDate,
      accountId: filters?.accountId,
      categoryId: filters?.categoryId,
      type: filters?.type,
      search: filters?.search,
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder,
      seeInvoices: filters?.seeInvoices,
    });
  },

  createTransaction: (data: CreateTransactionRequest) =>
    api.post<unknown>(`${BASE}/CreateTransaction`, data),

  updateTransaction: (data: UpdateTransactionRequest) =>
    api.patch<unknown>(`${BASE}/UpdateTransaction`, data),

  deleteTransaction: (id: number) =>
    api.delete<void>(`${BASE}/DeleteTransaction/${id}`),

  createTransference: (data: CreateTransferenceRequest) =>
    api.post<InfoTransferenceResponse>(`${BASE}/CreateTransference`, data),
};
