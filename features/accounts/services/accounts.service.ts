import { api } from "@/lib/api/client";
import type {
  AccountInfo,
  BalanceStatement,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types";

const BASE = "/Account";

export const accountService = {
  getAccounts: () =>
    api.get<AccountInfo[]>(BASE),

  getAccountsWithoutCreditCard: () =>
    api.get<AccountInfo[]>(`${BASE}/GetAccountsWithoutCreditCard`),

  createAccount: (data: CreateAccountRequest) =>
    api.post<AccountInfo>(`${BASE}/CreateAccount`, data),

  updateAccount: (data: UpdateAccountRequest) =>
    api.patch<AccountInfo>(`${BASE}/UpdateAccount`, data),

  deleteAccount: (id: number) =>
    api.delete<void>(`${BASE}/DeleteAccount/${id}`),

  getBalanceStatement: () =>
    api.get<BalanceStatement>(`${BASE}/GetBalanceStatement`),

  getAccountBalance: () =>
    api.get<number>(`${BASE}/GetAccountBalance`),
};
