import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateExpense } from '../models/CreateExpense';

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
}
