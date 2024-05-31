import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { CreateExpenseModalComponent } from '../../components/create-expense-modal/create-expense-modal.component';
import { CreateTansactionsTypesComponent } from '../../components/create-transactions-types/create-transactions-types.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountService } from '../../services/account.service';
import { BalanceStatement } from '../../models/BalanceStatement';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    AccountModalComponent,
    CreateExpenseModalComponent,
    CreateTansactionsTypesComponent,
    SidebarComponent,
  ],
  providers: [
    /* { provide: LOCALE_ID, useValue: 'pt-BR' } */
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  balance!: BalanceStatement;

  accountModalComponent!: AccountModalComponent;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getBalance().subscribe((b) => {
      this.balance = b;
    });
  }
}
