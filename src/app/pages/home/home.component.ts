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
import { InvestmentService } from '../../services/investment.service';
import { InfoInvestmentResponse } from '../../models/investments/InfoInvestmentResponse';
import { BoardButtonComponent } from '../../components/board-button/board-button.component';

type boardType = 'balance' | 'income' | 'expense' | 'invoice' | 'investment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    RouterLink,
    TransactionDialogComponent,
    TransferDialogComponent,
    BoardButtonComponent,
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
  investments: InfoInvestmentResponse[] | undefined;

  transactionsListSize: number = 5;
  totalInvested: number = 0;
  totalNetWorth: number = 0;

  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
    private readonly transactionService: TransactionService,
    private readonly investmentService: InvestmentService,
    public formaterService: FormaterService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setBoardDetails('balance');
    this.userService.getUser().subscribe((user) => (this.user = user));
    this.loadInvestments();
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
      this.totalNetWorth = (b.balance ?? 0) + (this.totalInvested ?? 0);
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
        1,
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
            (t) => t.type === TransactionTypeEnum.INCOME,
          );
          this.transactions = this.transactions;
        },
      });
    }

    if (type === 'expense') {
      this.transactionService.getTransactions().subscribe({
        next: (transactions) => {
          this.transactions = transactions.transactions.filter(
            (t) => t.type === TransactionTypeEnum.EXPENSE,
          );
          this.transactions = this.transactions;
        },
      });
    }

    if (type === 'investment') {
      this.loadInvestments();
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

  sumInvestments() {
    return this.investments?.reduce((prev, act) => prev + act.currentValue, 0);
  }

  private loadInvestments() {
    this.investmentService.getInvestments().subscribe((inv) => {
      this.investments = inv;
      this.totalInvested = inv.reduce(
        (total, current) => total + (current.currentValue ?? 0),
        0,
      );
      this.totalNetWorth = (this.balance.balance ?? 0) + this.totalInvested;
    });
  }
}
