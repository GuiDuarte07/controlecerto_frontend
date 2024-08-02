import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoTransactionResponse } from '../models/InfoTransactionResponse';
import { CreateTransactionRequest } from '../models/CreateTransaction';
import { TransactionList } from '../models/TransactionList';
import { UpdateTransactionRequest } from '../models/UpdateTransaction';
import { serverConnectionString } from '../config/server';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private hostAddress = `${serverConnectionString}/Transaction`;

  constructor(private http: HttpClient) {}

  createTransaction(transaction: CreateTransactionRequest) {
    const suffix = 'CreateTransaction';
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, transaction);
  }

  updateTransaction(transaction: UpdateTransactionRequest) {
    const suffix = 'UpdateTransaction';
    return this.http.patch<any>(`${this.hostAddress}/${suffix}`, transaction);
  }

  deleteTransaction(transactionId: number) {
    const suffix = 'DeleteTransaction';
    return this.http.delete(`${this.hostAddress}/${suffix}/${transactionId}`);
  }

  getTransactions(startDate?: Date, endDate?: Date, accountId?: number) {
    const suffix = 'GetTransactions';

    let params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (accountId) params.accountId = accountId;

    return this.http.get<TransactionList>(`${this.hostAddress}/${suffix}`, {
      params: params,
    });
  }
}
