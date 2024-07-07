import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreditCardInfo } from '../models/CreditCardInfo';
import { CreateCreditPurchaseRequest } from '../models/CreateCreditPurchaseRequest ';
import { CreateCreditCardRequest } from '../models/CreateCreditCardRequest';
import { InfoInvoiceResponse } from '../models/InfoInvoiceResponse';
import { InfoCreditExpense } from '../models/InfoCreditExpense';
import { InvoicePageResponse } from '../models/InvoicePageResponse';
import { CreateInvoicePaymentRequest } from '../models/CreteInvoicePaymentRequest';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private hostAddress = 'http://localhost:5037/api/CreditCard';

  constructor(private http: HttpClient) {}

  getCreditCards(): Observable<CreditCardInfo[]> {
    const suffix = 'GetCreditCardInfo';
    return this.http
      .get<CreditCardInfo[]>(`${this.hostAddress}/${suffix}`)
      .pipe(
        map((data) =>
          data.map(
            (item) =>
              new CreditCardInfo(
                item.id,
                item.totalLimit,
                item.usedLimit,
                item.description,
                item.dueDay,
                item.closeDay,
                item.account
              )
          )
        )
      );
  }

  getInvoices(accountId: number): Observable<InfoInvoiceResponse[]> {
    const suffix = 'GetInvoicesWithPagination';
    return this.http
      .get<InfoInvoiceResponse[]>(`${this.hostAddress}/${suffix}`, {
        params: {
          pageNumber: 0,
          accountId: accountId,
        },
      })
      .pipe(
        map((data) =>
          data.map(
            (item) =>
              new InfoInvoiceResponse(
                item.id,
                item.totalAmount,
                item.totalPaid,
                item.isPaid,
                new Date(item.closingDate),
                new Date(item.dueDate),
                item.creditCard,
                undefined
              )
          )
        )
      );
  }

  createCreditPurchase(creditPurchase: CreateCreditPurchaseRequest) {
    const suffix = 'CreateCreditPurchase';
    console.log('enviando', creditPurchase);
    //retorna InfoCreditPurchaseResponse, porém como não terá uso ainda, não irei implementar
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, creditPurchase);
  }

  createCreditCard(creditCard: CreateCreditCardRequest) {
    const suffix = 'CreateCreditCard';
    console.log('enviando', creditCard);
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, creditCard);
  }

  getCreditExpensesFromInvoice(
    invoiceId: number
  ): Observable<InfoCreditExpense[]> {
    const suffix = 'GetCreditExpensesFromInvoice';
    return this.http
      .get<InfoCreditExpense[]>(`${this.hostAddress}/${suffix}/${invoiceId}`)
      .pipe(
        map((data) =>
          data.map(
            (item) =>
              new InfoCreditExpense(
                item.id,
                item.amount,
                item.description ?? '',
                new Date(item.purchaseDate),
                item.installmentNumber,
                item.destination,
                item.creditPurchaseId
              )
          )
        )
      );
  }

  getInvoicesById(invoiceId: number): Observable<InvoicePageResponse> {
    const suffix = 'GetInvoicesById';
    return this.http
      .get<InvoicePageResponse>(`${this.hostAddress}/${suffix}/${invoiceId}`)
      .pipe(
        map(
          (data) =>
            new InvoicePageResponse(
              new InfoInvoiceResponse(
                data.invoice.id,
                data.invoice.totalAmount,
                data.invoice.totalPaid,
                data.invoice.isPaid,
                new Date(data.invoice.closingDate),
                new Date(data.invoice.dueDate),
                data.invoice.creditCard,
                data.invoice.transactions,
                data.invoice.invoicePayments
              ),
              data.nextInvoiceId,
              data.prevInvoiceId
            )
        )
      );
  }

  payInvoice(invoicePayment: CreateInvoicePaymentRequest) {
    const suffix = 'PayInvoice';
    //retorna InfoCreditPurchaseResponse, porém como não terá uso ainda, não irei implementar
    return this.http.post<any>(`${this.hostAddress}/${suffix}`, invoicePayment);
  }
}
