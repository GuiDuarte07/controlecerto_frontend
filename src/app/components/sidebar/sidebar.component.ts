import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionDialogComponent } from '../dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  openIncomeDialog() {
    this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.INCOME,
      },
    });
  }

  openExpenseDialog() {
    this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.EXPENSE,
      },
    });
  }

  openCreditExpenseDialog() {
    this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.CREDITEXPENSE,
      },
    });
  }
}
