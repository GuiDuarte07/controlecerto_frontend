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
import { CreditCardService } from '../../services/credit-card.service';
import { RouterLink } from '@angular/router';
import { InvoicePaymentDialogComponent } from '../../components/dialogs/invoice-payment-dialog/invoice-payment-dialog.component';
import { Account } from '../../models/AccountRequest ';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    RouterLink,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions: InfoTransactionResponse[] = [];
  invoices: InfoInvoiceResponse[] = [];
  accountBalance: number = 0;

  accountSelection = signal(true);
  accounts: Account[] | undefined;

  private readonly todayDate = new Date();
  filterDate: Date = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    1
  );

  filterOptions: {
    dateFilterDes: boolean;
    accountFilter: number | null;
    textFilter: string;
  } = {
    dateFilterDes: true,
    accountFilter: null,
    textFilter: '',
  };

  constructor(
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    private accountService: AccountService,
    public formaterService: FormaterService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateTransactions();

    this.accountService.getAccounts().subscribe((acc) => (this.accounts = acc));
  }

  get filteredTransactions() {
    let filtered = [...this.transactions];

    // Filtrar por conta
    if (this.filterOptions.accountFilter !== null) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.account.id === this.filterOptions.accountFilter
      );
    }

    // Filtrar por texto (descrição, amount, observations)
    if (this.filterOptions.textFilter.trim() !== '') {
      const searchText = this.filterOptions.textFilter.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchText) ||
          transaction.amount.toString().includes(searchText) ||
          (transaction.observations &&
            transaction.observations.toLowerCase().includes(searchText))
      );
    }

    // Ordenar por data
    filtered.sort((a, b) => {
      const dateA = new Date(a.purchaseDate).getTime();
      const dateB = new Date(b.purchaseDate).getTime();
      return this.filterOptions.dateFilterDes ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }

  changeDateFilter() {
    this.filterOptions.dateFilterDes = !this.filterOptions.dateFilterDes;
  }

  changeAccountFilter(accountId: number | null) {
    this.filterOptions.accountFilter = accountId;
  }

  toggleAccountSelection() {
    this.accountSelection.set(!this.accountSelection());
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

    this.updateAccountBalance();
  }

  updateAccountBalance() {
    this.accountService.getAccountBalance().subscribe((result) => {
      this.accountBalance = result;
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
      if (
        t.type === TransactionTypeEnum.EXPENSE ||
        t.type === TransactionTypeEnum.INVOICEPAYMENT
      ) {
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

  openDeleteAlertDialog(transaction: InfoTransactionResponse) {
    if (transaction.type === TransactionTypeEnum.CREDITEXPENSE) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Deletar lançamento',
          message: `Você tem certeza que deseja deletar esse lançamento?
                    ${transaction.description}
                     \n* Lembrando que esse processo irá deletar todas as parcelas dessa compra, mas só será possível se nenhuma fatura tiver sido paga ainda.
          `,
          successMessage: 'Lançamento deletado com sucesso!',
          actionButtonMessage: 'Deletar',
          confirmObservable: this.creditCardService.deleteCreditPurchase(
            transaction.creditPurchase!.id!
          ),
        },
      });
      dialogRef.afterClosed().subscribe((sucess) => {
        if ((sucess as boolean) === true) {
          this.updateTransactions();
        }
      });

      return;
    }

    if (transaction.type === TransactionTypeEnum.INVOICEPAYMENT) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Deletar lançamento',
          message: `Você tem certeza que deseja excluir esse pagamento de fatura?
                    \n${transaction.description}
          `,
          successMessage: 'Pagamento deletado com sucesso!',
          actionButtonMessage: 'Deletar',
          confirmObservable: this.creditCardService.deleteInvoicePayment(
            transaction.id
          ),
        },
      });
      dialogRef.afterClosed().subscribe((sucess) => {
        if ((sucess as boolean) === true) {
          this.updateTransactions();
        }
      });

      return;
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Deletar lançamento',
        message: `Você tem certeza que deseja deletar esse lançamento?
                  ${transaction.description}
        `,
        successMessage: 'Lançamento deletado com sucesso!',
        actionButtonMessage: 'Deletar',
        confirmObservable: this.transactionService.deleteTransaction(
          transaction.id
        ),
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
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
        this.updateTransactions();
      }
    });
  }

  openEditTransactionDialog(transaction: InfoTransactionResponse) {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: transaction.type,
        newTransaction: false,
        transaction,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }

  openPaymentInvoiceDialog(invoice: InfoInvoiceResponse): void {
    const dialogRef = this.dialog.open(InvoicePaymentDialogComponent, {
      data: {
        invoice,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }
}
