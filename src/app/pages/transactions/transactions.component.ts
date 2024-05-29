import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: InfoTransactionResponse[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService
      .getTransactionsWithPagination(1)
      .subscribe((result) => {
        this.transactions = result;
        console.log(this.transactions);
      });
  }

  formatDateString(dateString: string | Date): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;

    // Remove time part from dates for comparison
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Hoje';
    } else if (isYesterday) {
      return 'Ontem';
    } else if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString('pt-BR', {
        month: 'long',
        day: 'numeric',
      });
    } else {
      return date.toLocaleDateString('pt-BR', options);
    }
  }
}
