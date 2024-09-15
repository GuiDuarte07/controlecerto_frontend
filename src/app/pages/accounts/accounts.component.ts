import { AccountService } from './../../services/account.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum ';
import { AccountDialogComponent } from '../../components/dialogs/account-dialog/account-modal.component';
import { forkJoin, Observable } from 'rxjs';
import { Account } from '../../models/AccountRequest ';
import { BalanceStatement } from '../../models/BalanceStatement';
import { initFlowbite } from 'flowbite';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    AccountDialogComponent,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  accounts!: Account[];
  loading = false;
  mobileQuery: MediaQueryList;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  openAccountDialog(account?: Account) {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      panelClass: 'dialog-responsive',
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
  }

  updatedAccounts() {
    this.loading = true;
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      this.loading = false;
    });
  }

  openDeleteAlertDialog(account: Account) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Deletar lançamento',
        message: `Você tem certeza que deseja deletar esse conta?  ${account.bank}          
        `,
        successMessage: 'Conta deletada ou arquivada com sucesso!',
        actionButtonMessage: 'Deletar',
        confirmObservable: this.accountService.deleteAccount(account.id!),
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updatedAccounts();
      }
    });
  }
}
