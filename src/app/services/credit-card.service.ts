import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreditCardInfo } from '../models/CreditCardInfo';
import { CreateCreditPurchaseRequest } from '../models/CreateCreditPurchaseRequest ';
import { CreateCreditCardRequest } from '../models/CreateCreditCardRequest';
import { InfoInvoiceResponse } from '../models/InfoInvoiceResponse';

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
                item.cardBrand,
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
                item.totalAmount,
                item.isPaid,
                new Date(item.closingDate),
                new Date(item.dueDate)
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
}
