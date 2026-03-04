import { api } from "@/lib/api/client";
import type {
  CreditCardInfo,
  CreateCreditCardRequest,
  CreateCreditPurchaseRequest,
  CreateInvoicePaymentRequest,
  InfoCreditExpense,
  InfoInvoiceResponse,
  InvoicePageResponse,
  UpdateCreditCardRequest,
  UpdateCreditPurchaseRequest,
} from "@/types";

const BASE = "/CreditCard";

export const creditCardService = {
  getCreditCards: () =>
    api.get<CreditCardInfo[]>(`${BASE}/GetCreditCardInfo`),

  createCreditCard: (data: CreateCreditCardRequest) =>
    api.post<CreditCardInfo>(`${BASE}/CreateCreditCard`, data),

  updateCreditCard: (data: UpdateCreditCardRequest) =>
    api.patch<CreditCardInfo>(`${BASE}/UpdateCreditCard`, data),

  getInvoicesByDate: (params: {
    creditCardId?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get<InfoInvoiceResponse[]>(`${BASE}/GetInvoicesByDate`, params),

  getInvoiceById: (invoiceId: number) =>
    api.get<InvoicePageResponse>(`${BASE}/GetInvoicesById/${invoiceId}`),

  getCreditExpensesFromInvoice: (invoiceId: number) =>
    api.get<InfoCreditExpense[]>(
      `${BASE}/GetCreditExpensesFromInvoice/${invoiceId}`
    ),

  createCreditPurchase: (data: CreateCreditPurchaseRequest) =>
    api.post<unknown>(`${BASE}/CreateCreditPurchase`, data),

  updateCreditPurchase: (data: UpdateCreditPurchaseRequest) =>
    api.patch<unknown>(`${BASE}/UpdateCreditPurchase`, data),

  deleteCreditPurchase: (id: number) =>
    api.delete<void>(`${BASE}/DeleteCreditPurchase/${id}`),

  payInvoice: (data: CreateInvoicePaymentRequest) =>
    api.post<unknown>(`${BASE}/PayInvoice`, data),

  deleteInvoicePayment: (id: number) =>
    api.delete<void>(`${BASE}/DeleteInvoicePayment/${id}`),
};
