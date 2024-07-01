import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormaterService } from '../../services/formater.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: InfoTransactionResponse[] = [];

  constructor(
    private transactionService: TransactionService,
    public formaterService: FormaterService
  ) {}

  ngOnInit(): void {
    this.transactionService
      .getTransactionsWithPagination(1)
      .subscribe((result) => {
        this.transactions = result;
        console.log(this.transactions);
      });
  }
}
