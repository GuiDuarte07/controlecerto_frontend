import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Account } from '../../../models/AccountRequest ';
import { AccountTypeEnum } from '../../../enums/AccountTypeEnum ';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AccountModalComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent {
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
  ];
}
