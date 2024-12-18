import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { DetailsUserResponse } from '../../models/DetailsUserResponse';
import { RouterLink } from '@angular/router';
import { TransferDialogComponent } from '../../components/dialogs/transfer-dialog/transfer-dialog.component';
import {
  TransactionDialogComponent,
  TransactionDialogDataType,
} from '../../components/dialogs/transaction-dialog/transaction-dialog.component';

type boardType = 'balance' | 'income' | 'expense' | 'invoice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterLink,
    TransactionDialogComponent,
    TransferDialogComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('transactionDialog')
  transactionDialog!: TransactionDialogComponent;
  @ViewChild('transferDialog')
  transferDialog!: TransferDialogComponent;

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

  transactionsListSize: number = 5;

  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
    private readonly transactionService: TransactionService,
    public formaterService: FormaterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setBoardDetails('balance');
    this.userService.getUser().subscribe((user) => (this.user = user));
  }

  openTransactionDialog(type: TransactionTypeEnum) {
    const dialogData: TransactionDialogDataType = {
      newTransaction: true,
      transactionType: type,
    };

    this.transactionDialog.openDialog(dialogData);
    this.transactionDialog.closeEvent.subscribe((success: boolean) => {
      if (success === true) {
        this.setBoardDetails(this.boardOption);
      }
    });
  }

  openTranferDialog() {
    this.transferDialog.openDialog();
  }

  getBalances() {
    this.accountService.getBalance().subscribe((b) => {
      this.balance = b;
    });
  }

  setBoardDetails(type: boardType) {
    this.boardOption = type;
    this.transactionsListSize = 5;

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
          this.transactions = this.transactions;
        },
      });
    }

    if (type === 'expense') {
      this.transactionService.getTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions.transactions.filter(
            (t) => t.type === TransactionTypeEnum.EXPENSE
          );
          this.transactions = this.transactions;
        },
      });
    }

    this.getBalances();
  }

  seeMoreTransactions() {
    this.transactionsListSize += 5;
  }

  sumTransactions() {
    return this.transactions
      ?.slice(0, this.transactionsListSize)
      ?.reduce((prev, act) => prev + act.amount, 0);
  }
}
