import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/AccountRequest ';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private hostAddress = 'http://localhost:5037/api/Account';

  constructor(private httpClient: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(this.hostAddress);
  }
}
