import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateExpense } from '../models/CreateExpense';
import { CreateIncome } from '../models/CreateIncome';
import { InfoTransactionResponse } from '../models/InfoTransactionResponse';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private hostAddress = 'http://localhost:5037/api/Transaction';

  constructor(private http: HttpClient) {}

  createExpense(expense: CreateExpense) {
    const suffix = 'CreateExpense';
    //retorna InfoExpenseResponse, porém como não terá uso ainda, não irei implementar
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, expense);
  }

  createIncome(income: CreateIncome) {
    const suffix = 'CreateIncome';
    //retorna InfoIncomeResponse, porém como não terá uso ainda, não irei implementar
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, income);
  }

  getTransactionsWithPagination(
    startDate?: Date,
    endDate?: Date,
    accountId?: number
  ) {
    const suffix = 'GetTransactionsWithPagination';

    let params: any = { pageNumber: 1 };
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (accountId) params.accountId = accountId;

    return this.http.get<InfoTransactionResponse[]>(
      `${this.hostAddress}/${suffix}`,
      {
        params: params,
      }
    );
  }
}
