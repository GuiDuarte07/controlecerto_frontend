import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Account } from '../models/AccountRequest ';
import { BalanceStatement } from '../models/BalanceStatement';
import { UpdateAccountRequest } from '../models/UpdateAccountRequest';
import { serverConnectionString } from '../config/server';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private hostAddress = `${serverConnectionString}/Account`;

  constructor(private httpClient: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(this.hostAddress).pipe(
      map((data) =>
        data.map(
          (item) =>
            new Account({
              id: item.id,
              balance: item.balance,
              description: item.description,
              bank: item.bank,
              color: item.color,
            })
        )
      )
    );
  }

  getAccountsWithoutCreditCard(): Observable<Account[]> {
    const suffix = 'GetAccountsWithoutCreditCard';
    return this.httpClient.get<Account[]>(`${this.hostAddress}/${suffix}`).pipe(
      map((data) =>
        data.map(
          (item) =>
            new Account({
              id: item.id,
              balance: item.balance,
              description: item.description,
              bank: item.bank,
              color: item.color,
            })
        )
      )
    );
  }

  createAccount(account: Account): Observable<Account> {
    const suffix = 'CreateAccount';
    return this.httpClient.post<Account>(
      `${this.hostAddress}/${suffix}`,
      account
    );
  }

  deleteAccount(accountId: number): Observable<void> {
    const suffix = 'DeleteAccount';
    return this.httpClient.delete<void>(
      `${this.hostAddress}/${suffix}/${accountId}`
    );
  }

  updateAccount(updateAccount: UpdateAccountRequest): Observable<Account> {
    const suffix = 'UpdateAccount';
    return this.httpClient.patch<Account>(
      `${this.hostAddress}/${suffix}`,
      updateAccount
    );
  }

  getBalance(): Observable<BalanceStatement> {
    const suffix = 'GetBalanceStatement';
    return this.httpClient.get<BalanceStatement>(
      `${this.hostAddress}/${suffix}`
    );
  }

  getAccountBalance(): Observable<number> {
    const suffix = 'GetAccountBalance';
    return this.httpClient.get<number>(`${this.hostAddress}/${suffix}`);
  }
}
