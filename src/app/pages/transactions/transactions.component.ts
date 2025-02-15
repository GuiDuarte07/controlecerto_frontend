import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormaterService } from '../../services/formater.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { AccountService } from '../../services/account.service';
import { RouterLink } from '@angular/router';
import { InvoicePaymentDialogComponent } from '../../components/dialogs/invoice-payment-dialog/invoice-payment-dialog.component';
import { Account } from '../../models/AccountRequest ';
import { SelectionComponent } from '../../components/selection/selection.component';
import { TransactionExpansionPanelComponent } from '../../components/transaction-expansion-panel/transaction-expansion-panel.component';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { TransferDialogComponent } from '../../components/dialogs/transfer-dialog/transfer-dialog.component';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import {
  TransactionDialogComponent,
  TransactionDialogDataType,
} from '../../components/dialogs/transaction-dialog/transaction-dialog.component';

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
    SelectionComponent,
    TransactionExpansionPanelComponent,
    FormsModule,
    MatCheckbox,
    OverlayPanelModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    DropdownModule,
    ToggleButtonModule,
    SelectButtonModule,
    AccordionModule,
    CheckboxModule,
    TransactionDialogComponent,
    TransferDialogComponent,
    InvoicePaymentDialogComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  @ViewChild('invoicePaymentDialog')
  invoicePaymentDialog!: InvoicePaymentDialogComponent;

  @ViewChild('transactionDialog')
  transactionDialog!: TransactionDialogComponent;

  @ViewChild('transferDialog')
  transferDialog!: TransferDialogComponent;

  transactions: InfoTransactionResponse[] = [];
  invoices: InfoInvoiceResponse[] = [];
  accountBalance: number = 0;

  accountSelection = signal(true);
  accounts: Account[] | undefined;

  showTransactionSearch: boolean = false;
  selectMode: boolean = false;
  selectedTransactions: InfoTransactionResponse[] = [];

  private readonly todayDate = new Date();
  filterDate: Date = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    1
  );

  filterOptions: {
    dateFilterDes: boolean;
    accountFilter: Account | null;
    textFilter: string;
    hideInvoices: boolean;
    type: boolean;
  } = {
    dateFilterDes: true,
    accountFilter: null,
    textFilter: '',
    hideInvoices: false,
    type: false,
  };

  dataOptionsLabel: any[] = [
    { label: 'Descrecente', value: true },
    { label: 'Crescente', value: false },
  ];

  constructor(
    private transactionService: TransactionService,
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
          transaction.account.id === this.filterOptions.accountFilter?.id
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

    // Ordenar pro tipo
    if (this.filterOptions.type) {
      const transactionOrder = {
        [TransactionTypeEnum.INCOME]: 0,
        [TransactionTypeEnum.EXPENSE]: 1,
        [TransactionTypeEnum.CREDITEXPENSE]: 2,
        [TransactionTypeEnum.INVOICEPAYMENT]: 3,
        [TransactionTypeEnum.TRANSFERENCE]: 4,
      };

      filtered.sort(
        (a, b) => transactionOrder[a.type] - transactionOrder[b.type]
      );
    }

    return filtered;
  }

  setSeeInvoice() {
    this.updateTransactions();
  }

  toggleTransactionSearch() {
    this.showTransactionSearch = !this.showTransactionSearch;

    if (!this.showTransactionSearch) {
      this.filterOptions.textFilter = '';
    }
  }

  changeDateFilter() {
    this.filterOptions.dateFilterDes = !this.filterOptions.dateFilterDes;
  }

  toggleAccountSelection() {
    this.accountSelection.set(!this.accountSelection());
  }

  checkedTransatcionUpdate({
    transaction,
    checked,
  }: {
    transaction: InfoTransactionResponse;
    checked: boolean;
  }) {
    if (checked) {
      this.selectedTransactions.push(transaction);
    } else {
      this.selectedTransactions = this.selectedTransactions.filter(
        (t) => t.id !== transaction.id
      );
    }
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
      .getTransactions(
        firstDayOfMonthUTC,
        lastDayOfMonthUTC,
        !this.filterOptions.hideInvoices
      )
      .subscribe((result) => {
        this.transactions = result.transactions;
        this.invoices = result.invoices;
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

    const transactions = this.selectMode
      ? this.selectedTransactions
      : this.filteredTransactions;

    transactions.forEach((t) => {
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

    const transactions = this.selectMode
      ? this.selectedTransactions
      : this.filteredTransactions;

    transactions.forEach((t) => {
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

  openCreateTransactionDialog(type: TransactionTypeEnum) {
    const dialogData: TransactionDialogDataType = {
      newTransaction: true,
      transactionType: type,
    };

    this.transactionDialog.openDialog(dialogData);
    this.transactionDialog.closeEvent.subscribe((success: boolean) => {
      if (success === true) {
        this.updateTransactions();
      }
    });
  }

  openTranferDialog() {
    this.transferDialog.openDialog();
  }

  openPaymentInvoiceDialog(invoice: InfoInvoiceResponse) {
    this.invoicePaymentDialog.openDialog({ invoice });
    this.invoicePaymentDialog.closeEvent.subscribe((success: boolean) => {
      if (success === true) {
        this.updateTransactions();
      }
    });
  }
}
