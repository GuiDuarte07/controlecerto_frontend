import { AccountService } from './../../services/account.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum ';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { Observable } from 'rxjs';
import { Account } from '../../models/AccountRequest ';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AccountModalComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  $accounts!: Observable<Account[]>;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.$accounts = this.accountService.getAccounts();
  }
}

/*
accounts = [
    new Account({
      balance: 120,
      description: 'Minha cartera',
      bank: 'carteira',
      accountType: AccountTypeEnum.WALLET,
      color: '#EEE9C0',
      id: 12,
    }),
    new Account({
      balance: 5645.97,
      description: 'Conta Salário',
      bank: 'santander',
      accountType: AccountTypeEnum.SAVINGS,
      color: '#89C9AE',
      id: 12,
    }),
    new Account({
      balance: 532534.56,
      description: 'Saldo de investimento',
      bank: 'xp investiments',
      accountType: AccountTypeEnum.INVESTMENT,
      color: '#196CA5',
      id: 54,
    }),
  ]; */
