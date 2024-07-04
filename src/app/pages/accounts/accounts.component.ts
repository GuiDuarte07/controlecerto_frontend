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
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    AccountDialogComponent,
    MatButtonModule,
    MatMenuModule,
  ],
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

  openAccountDialog(account?: Account) {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      data: account ? { newAccount: false, account } : { newAccount: true }, //error
    });
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

  openDeleteAlertDialog(account: Account) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Deletar lançamento',
        message: `Você tem certeza que deseja deletar esse conta?  ${account.bank}          
        `,
        successMessage: 'cancelamento deletado com sucesso!',
        actionButtonMessage: 'Deletar',
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        alert('ainda nao implementado');
      }
    });
  }
}
