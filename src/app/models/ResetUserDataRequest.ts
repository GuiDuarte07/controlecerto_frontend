export interface ResetUserDataRequest {
  accounts: boolean;
  transactions: boolean;
  categories: boolean;
  creditCards: boolean;
  invoices: boolean;
  recurringTransactions: boolean;
  notifications: boolean;
  transferences: boolean;
}
