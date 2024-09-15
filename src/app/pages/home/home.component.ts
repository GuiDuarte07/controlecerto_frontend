import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountService } from '../../services/account.service';
import { BalanceStatement } from '../../models/BalanceStatement';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/AccountRequest ';
import { CreditCardService } from '../../services/credit-card.service';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { FormaterService } from '../../services/formater.service';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionDialogComponent } from '../../components/dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { DetailsUserResponse } from '../../models/DetailsUserResponse';

type boardType = 'balance' | 'income' | 'expense' | 'invoice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  balance: BalanceStatement = {
    balance: 0,
    expenses: 0,
    incomes: 0,
    invoices: 0,
  };

  boardOption!: boardType;

  user: DetailsUserResponse | null = null;

  accounts: Account[] | undefined;
  invoices: InfoInvoiceResponse[] | undefined;
  transactions: InfoTransactionResponse[] | undefined;

  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
    private readonly transactionService: TransactionService,
    public formaterService: FormaterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountService.getBalance().subscribe((b) => {
      this.balance = b;
    });

    this.setBoardDetails('balance');
    this.userService.getUser().subscribe((user) => (this.user = user));
  }

  setBoardDetails(type: boardType) {
    this.boardOption = type;

    if (type === 'balance' /*  && this.accounts === undefined */) {
      this.accountService
        .getAccounts()
        .subscribe((acc) => (this.accounts = acc));
    }

    if (type === 'invoice' /*  && this.invoices === undefined */) {
      const currentDate = new Date();

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      this.creditCardService
        .getInvoices(undefined, firstDayOfMonth, firstDayOfMonth)
        .subscribe((i) => {
          this.invoices = i;
        });
    }

    if (type === 'income') {
      this.transactionService.getTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions.transactions.filter(
            (t) => t.type === TransactionTypeEnum.INCOME
          );
          this.transactions = this.transactions.slice(0, 5);
        },
      });
    }

    if (type === 'expense') {
      this.transactionService.getTransactions().subscribe({
        next: (transactions) => {
          console.log(transactions);
          this.transactions = transactions.transactions.filter(
            (t) => t.type === TransactionTypeEnum.EXPENSE
          );
          this.transactions = this.transactions.slice(0, 5);
          console.log(this.transactions);
        },
      });
    }
  }

  sumTransactions() {
    return this.transactions?.reduce((prev, act) => prev + act.amount, 0);
  }

  openCreateTransactionDialog(type: TransactionTypeEnum) {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: type,
        newTransaction: true,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.setBoardDetails(this.boardOption);
      }
    });
  }
}
