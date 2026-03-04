// ============================================================
// Shared / Global Types - Controle Certo
// ============================================================

import type {
  AccountTypeEnum,
  BillTypeEnum,
  NotificationTypeEnum,
  TransactionTypeEnum,
} from "./enums";

// ----- User -----
export interface InfoUserResponse {
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;
}

export interface DetailsUserResponse extends InfoUserResponse {
  createdAt: string;
}

export interface UpdateUserRequest {
  name?: string;
}

export interface ResetUserDataRequest {
  password: string;
  deleteTransactions: boolean;
  deleteAccounts: boolean;
  deleteCategories: boolean;
  deleteCreditCards: boolean;
  deleteInvestments: boolean;
}

export interface ResetUserDataResponse {
  transactionsDeleted: number;
  accountsDeleted: number;
  categoriesDeleted: number;
  creditCardsDeleted: number;
  investmentsDeleted: number;
}

// ----- Auth -----
export interface AuthResponse {
  user: InfoUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ----- Account -----
export interface AccountInfo {
  id: number;
  balance: number;
  description: string;
  bank: string;
  accountType: AccountTypeEnum;
  color: string;
}

export interface CreateAccountRequest {
  balance: number;
  description: string;
  bank: string;
  color: string;
}

export interface UpdateAccountRequest {
  id: number;
  description?: string;
  bank?: string;
  color?: string;
}

// ----- Category -----
export interface Category {
  id?: number;
  name: string;
  icon: string;
  billType: BillTypeEnum;
  color: string;
  limit?: number;
  parentId?: number;
}

export interface ParentCategory extends Category {
  subCategories: Category[];
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
  icon?: string;
  color?: string;
  limit?: number;
}

export interface InfoLimitResponse {
  categoryId: number;
  categoryName: string;
  limit: number;
  totalSpent: number;
  remaining: number;
}

// ----- Transaction -----
export interface InfoTransactionResponse {
  id: number;
  type: TransactionTypeEnum;
  amount: number;
  purchaseDate: string;
  description: string;
  observations?: string;
  destination?: string;
  justForRecord: boolean;
  account: AccountInfo;
  category?: Category;
  creditPurchase?: InfoCreditPurchaseResponse;
  installmentNumber?: number;
}

export interface CreateTransactionRequest {
  amount: number;
  type: TransactionTypeEnum;
  purchaseDate: string;
  destination: string;
  description?: string;
  observations?: string;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;
}

export interface UpdateTransactionRequest {
  id: number;
  amount?: number;
  purchaseDate?: string;
  description?: string;
  observations?: string;
  destination?: string;
  accountId?: number;
  categoryId?: number;
  justForRecord?: boolean;
}

export interface TransactionListResponse {
  transactions: InfoTransactionResponse[];
  invoices: InfoInvoiceResponse[];
}

export interface BalanceStatement {
  balance: number;
  incomes: number;
  expenses: number;
  invoices: number;
}

export interface CreateTransferenceRequest {
  amount: number;
  description: string | null;
  purchaseDate: string;
  accountOriginId: number | null;
  accountDestinyId: number | null;
}

export interface InfoTransferenceResponse extends CreateTransferenceRequest {
  id: number;
}

// ----- Credit Card -----
export interface CreditCardInfo {
  id: number;
  totalLimit: number;
  usedLimit: number;
  description: string;
  dueDay: number;
  closeDay: number;
  account: AccountInfo;
}

export interface CreateCreditCardRequest {
  totalLimit: number;
  usedLimit: number;
  description: string;
  dueDay: number;
  closeDay: number;
  accountId: number;
  skipWeekend: boolean;
}

export interface UpdateCreditCardRequest {
  id: number;
  totalLimit?: number;
  description?: string;
  dueDay?: number;
  closeDay?: number;
  skipWeekend?: boolean;
}

// ----- Credit Purchase -----
export interface InfoCreditPurchaseResponse {
  id: number;
  totalAmount: number;
  totalInstallment: number;
  installmentsPaid: number;
  purchaseDate?: string;
  paid: boolean;
  destination: string;
  description?: string;
  creditCardId: number;
}

export interface CreateCreditPurchaseRequest {
  totalAmount: number;
  totalInstallment: number;
  installmentsPaid: number;
  purchaseDate: string | null;
  destination: string;
  description?: string;
  creditCardId: number;
  categoryId: number;
}

export interface UpdateCreditPurchaseRequest {
  id: number;
  totalAmount?: number;
  destination?: string;
  description?: string;
  categoryId?: number;
}

// ----- Invoice -----
export interface InfoInvoiceResponse {
  id: number;
  totalAmount: number;
  totalPaid: number;
  isPaid: boolean;
  invoiceDate: string;
  closingDate: string;
  dueDate: string;
  creditCard: CreditCardInfo;
  transactions?: InfoTransactionResponse[];
  invoicePayments?: InfoInvoicePaymentResponse[];
}

export interface InfoInvoicePaymentResponse {
  id: number;
  amountPaid: number;
  description: string;
  paymentDate: string;
  account: AccountInfo;
  justForRecord: boolean;
}

export interface CreateInvoicePaymentRequest {
  invoiceId: number;
  amountPaid: number;
  description: string;
  paymentDate: string;
  accountId: number;
  justForRecord: boolean;
}

export interface InvoicePageResponse {
  invoice: InfoInvoiceResponse;
  nextInvoiceId: number | null;
  prevInvoiceId: number | null;
}

export interface InfoCreditExpense {
  id: number;
  amount: number;
  description: string;
  purchaseDate: string;
  installmentNumber: number;
  destination: string;
  creditPurchaseId: number;
}

// ----- Investment -----
export interface InfoInvestmentResponse {
  id: number;
  name: string;
  currentValue: number;
  description?: string | null;
  startDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  histories?: InvestmentHistoryResponse[] | null;
}

export interface InvestmentHistoryResponse {
  id: number;
  occurredAt: string;
  changeAmount: number;
  totalValue: number;
  note?: string | null;
  sourceAccountId?: number | null;
  type: string;
}

export interface CreateInvestmentRequest {
  name: string;
  initialAmount?: number | null;
  startDate?: string | null;
  description?: string | null;
}

export interface UpdateInvestmentRequest {
  id: number;
  name?: string;
  description?: string | null;
  startDate?: string | null;
}

export interface DepositInvestmentRequest {
  investmentId: number;
  amount: number;
  accountId?: number | null;
  occurredAt?: string | null;
  note?: string | null;
}

export interface AdjustInvestmentRequest {
  investmentId: number;
  newTotalValue: number;
  occurredAt?: string | null;
  note?: string | null;
}

// ----- Notification -----
export interface InfoNotificationResponse {
  id: number;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  actionPath?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt: string;
}

// ----- Pagination / Filters -----
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: number;
  categoryId?: number;
  type?: TransactionTypeEnum;
  search?: string;
  sortBy?: "date" | "amount" | "description";
  sortOrder?: "asc" | "desc";
  seeInvoices?: boolean;
}
