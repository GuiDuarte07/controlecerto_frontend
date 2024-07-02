import { AccountService } from './../../services/account.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum ';
import { AccountDialogComponent } from '../../components/dialogs/account-dialog/account-modal.component';
import { Observable } from 'rxjs';
import { Account } from '../../models/AccountRequest ';
import { BalanceStatement } from '../../models/BalanceStatement';
import { initFlowbite } from 'flowbite';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AccountDialogComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  accounts$!: Observable<Account[]>;
  balance!: BalanceStatement;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog
  ) {}

  openAccountDialog() {
    const dialogRef = this.dialog.open(AccountDialogComponent);
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updatedAccounts();
      }
    });
  }

  ngOnInit(): void {
    this.updatedAccounts();

    this.accountService.getBalance().subscribe((b) => (this.balance = b));
  }

  updatedAccounts() {
    this.accounts$ = this.accountService.getAccounts();
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
