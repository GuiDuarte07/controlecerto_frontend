import { AccountsComponent } from './../accounts/accounts.component';
import { Component, OnInit, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormaterService } from '../../services/formater.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { CreateTransactionDialogComponent } from '../../components/dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: InfoTransactionResponse[] = [];
  invoices: InfoInvoiceResponse[] = [];
  accountBalance: number = 0;

  private readonly todayDate = new Date();
  filterDate: Date = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    1
  );

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    public formaterService: FormaterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateTransactions();

    this.accountService.getAccountBalance().subscribe((result) => {
      this.accountBalance = result;
    });
  }

  updateTransactions() {
    const firstDayOfMonth = new Date(
      this.filterDate.getFullYear(),
      this.filterDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.filterDate.getFullYear(),
      this.filterDate.getMonth() + 1,
      0
    );

    const firstDayOfMonthUTC = new Date(
      Date.UTC(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth(),
        firstDayOfMonth.getDate()
      )
    );

    const lastDayOfMonthUTC = new Date(
      Date.UTC(
        lastDayOfMonth.getFullYear(),
        lastDayOfMonth.getMonth(),
        lastDayOfMonth.getDate(),
        23,
        59,
        59
      )
    );

    this.transactionService
      .getTransactions(firstDayOfMonthUTC, lastDayOfMonthUTC)
      .subscribe((result) => {
        this.transactions = result.transactions;
        this.invoices = result.invoices;

        console.log(result);
      });
  }

  nexMonthFilter() {
    this.filterDate = new Date(
      this.filterDate.getFullYear(),
      this.filterDate.getMonth() + 1,
      1
    );

    this.updateTransactions();
  }

  prevMonthFilter() {
    this.filterDate = new Date(
      this.filterDate.getFullYear(),
      this.filterDate.getMonth() - 1,
      1
    );

    this.updateTransactions();
  }

  expensesTotal() {
    let expenseValue = 0;
    this.transactions.forEach((t) => {
      if (t.type === TransactionTypeEnum.EXPENSE) {
        expenseValue += t.amount;
      }
    });

    return expenseValue;
  }

  incomesTotal() {
    let incomeValue = 0;
    this.transactions.forEach((t) => {
      if (t.type === TransactionTypeEnum.INCOME) {
        incomeValue += t.amount;
      }
    });

    return incomeValue;
  }

  invoiceTotal() {
    return this.invoices.reduce(
      (acc, current) => acc + (current.totalAmount - current.totalPaid),
      0
    );
  }

  openAlertDialog(transaction: InfoTransactionResponse) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Deletar lançamento',
        message: `Você tem certeza que deseja deletar esse lançamento?
                  ${transaction.description}          
        `,
        successMessage: 'Lançamento deletado com sucesso!',
        actionButtonMessage: 'Deletar',
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        console.error('ainda nao implementado');
      }
    });
  }

  openIncomeDialog() {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.INCOME,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }

  openExpenseDialog() {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.EXPENSE,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }

  openCreditExpenseDialog() {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: TransactionTypeEnum.CREDITEXPENSE,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }
}
