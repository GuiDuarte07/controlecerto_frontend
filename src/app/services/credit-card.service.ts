import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCardInfo } from '../models/CreditCardInfo';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private hostAddress = 'http://localhost:5037/api/CreditCard';

  constructor(private httpClient: HttpClient) {}

  getCreditCards(): Observable<CreditCardInfo[]> {
    const suffix = 'GetCreditCardInfo';
    return this.httpClient.get<CreditCardInfo[]>(
      `${this.hostAddress}/${suffix}`
    );
  }
}
