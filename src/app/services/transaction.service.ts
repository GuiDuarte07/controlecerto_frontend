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
    console.log('enviando', expense);
    //retorna InfoExpenseResponse, porém como não terá uso ainda, não irei implementar
    return this.http
      .post<any>(`${this.hostAddress}/${suffix}`, expense)
      .subscribe({
        next: (d) => console.log(d),
        error: (d) => console.log(d),
      });
  }

  createIncome(income: CreateIncome) {
    const suffix = 'CreateIncome';
    console.log('enviando', income);
    //retorna InfoIncomeResponse, porém como não terá uso ainda, não irei implementar
    return this.http
      .post<any>(`${this.hostAddress}/${suffix}`, income)
      .subscribe({
        next: (d) => console.log(d),
        error: (d) => console.log(d),
      });
  }

  getTransactionsWithPagination(
    pageNumber: number,
    accountId?: number,
    startDate?: Date,
    endDate?: Date
  ) {
    const suffix = 'GetTransactionsWithPagination';

    let params: any = { pageNumber: pageNumber };
    if (accountId) params.accountId = accountId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.http.get<InfoTransactionResponse[]>(
      `${this.hostAddress}/${suffix}`,
      {
        params: params,
      }
    );
  }
}
