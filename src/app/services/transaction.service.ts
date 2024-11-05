import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoTransactionResponse } from '../models/InfoTransactionResponse';
import { CreateTransactionRequest } from '../models/CreateTransaction';
import { TransactionList } from '../models/TransactionList';
import { UpdateTransactionRequest } from '../models/UpdateTransaction';
import { serverConnectionString } from '../config/server';
import { map } from 'rxjs';
import { InfoInvoiceResponse } from '../models/InfoInvoiceResponse';
import { InfoInvoicePaymentResponse } from '../models/InfoInvoicePaymentResponse ';
import {
  CreateTransferenceRequest,
  InfoTransferenceResponse,
} from '../models/CreateTransferenceRequest';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private hostAddress = `${serverConnectionString}/Transaction`;

  constructor(private http: HttpClient) {}

  createTransference(transfer: CreateTransferenceRequest) {
    const suffix = 'CreateTransference';
    return this.http.post<InfoTransferenceResponse>(
      `${this.hostAddress}/${suffix}`,
      transfer
    );
  }

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

  getTransactions(
    startDate?: Date,
    endDate?: Date,
    seeInvoices?: boolean,
    accountId?: number
  ) {
    const suffix = 'GetTransactions';

    let params: any = {};

    if (startDate) {
      params.startDate = startDate.toISOString();
    } else {
      params.startDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString();
    }

    if (endDate) {
      params.endDate = endDate.toISOString();
    } else {
      params.endDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).toISOString();
    }

    if (accountId) params.accountId = accountId;

    if (seeInvoices) params.seeInvoices = seeInvoices;

    return this.http.get<TransactionList>(`${this.hostAddress}/${suffix}`, {
      params: params,
    });
    /*
    .pipe(
      map(response => {
        return new TransactionList({
          transactions: response.transactions.map(t => this.mapToInfoTransactionResponse(t)),
          invoices: response.invoices.map(this.mapToInfoInvoiceResponse),
        });
      })
    );
    */
  }

  private mapToInfoTransactionResponse(data: any): InfoTransactionResponse {
    console.log(data);
    return new InfoTransactionResponse({
      id: data.id,
      type: data.type,
      amount: data.amount,
      purchaseDate: new Date(data.purchaseDate),
      description: data.description,
      observations: data.observations,
      destination: data.destination,
      justForRecord: data.justForRecord,
      account: data.account,
      category: data.category,
      installmentNumber: data.installmentNumber,
      creditPurchase: data.creditPurchase ? data.creditPurchase : undefined,
    });
  }

  // Função para converter um objeto JSON em InfoInvoiceResponse
  private mapToInfoInvoiceResponse(data: any): InfoInvoiceResponse {
    return new InfoInvoiceResponse(
      data.id,
      data.totalAmount,
      data.totalPaid,
      data.isPaid,
      new Date(data.invoiceDate),
      new Date(data.closingDate),
      new Date(data.dueDate),
      data.creditCard,
      data.transactions
        ? data.transactions.map(this.mapToInfoTransactionResponse)
        : undefined,
      data.invoicePayments
        ? data.invoicePayments.map(this.mapToInfoInvoicePaymentResponse)
        : undefined
    );
  }

  // Função para converter um objeto JSON em InfoInvoicePaymentResponse
  private mapToInfoInvoicePaymentResponse(
    data: any
  ): InfoInvoicePaymentResponse {
    return new InfoInvoicePaymentResponse(
      data.id,
      data.amountPaid,
      data.description,
      new Date(data.paymentDate),
      data.account,
      data.justForRecord
    );
  }
}
