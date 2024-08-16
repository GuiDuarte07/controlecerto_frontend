import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountService } from '../../services/account.service';
import { BalanceStatement } from '../../models/BalanceStatement';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { Account } from '../../models/AccountRequest ';
import { CreditCardService } from '../../services/credit-card.service';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { FormaterService } from '../../services/formater.service';

type boardType = 'balance' | 'income' | 'expense' | 'invoice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  balance: BalanceStatement = {
    balance: 0,
    expenses: 0,
    incomes: 0,
    invoices: 0,
  };

  boardOption!: boardType;

  accounts: Account[] | undefined;
  invoices: InfoInvoiceResponse[] | undefined;

  constructor(
    private readonly accountService: AccountService,
    private readonly creditCardService: CreditCardService,
    public formaterService: FormaterService
  ) {}

  ngOnInit(): void {
    this.accountService.getBalance().subscribe((b) => {
      this.balance = b;
    });

    this.setBoardDetails('invoice');
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  setBoardDetails(type: boardType) {
    this.boardOption = type;

    if (type === 'balance' && this.accounts === undefined) {
      this.accountService
        .getAccounts()
        .subscribe((acc) => (this.accounts = acc));
    }

    if (type === 'invoice' && this.invoices === undefined) {
      const currentDate = new Date();

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      this.creditCardService
        .getInvoices(undefined, firstDayOfMonth, firstDayOfMonth)
        .subscribe((i) => {this.invoices = i;console.log(i)});
    }
  }
}
