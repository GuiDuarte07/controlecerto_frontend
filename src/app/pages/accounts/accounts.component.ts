// Angular imports
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

//Components imports
import { AccountService } from './../../services/account.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import {
  AccountDialogComponent,
  AccountDialogDataType,
} from '../../components/dialogs/account-dialog/account-dialog.component';
import { AlertDialogComponent } from '../../components/dialogs/alert-dialog/alert-dialog.component';
import { RegisterButtonComponent } from '../../components/ui/register-button/register-button.component';

//PrimeNg imports
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

//Others
import { Account } from '../../models/AccountRequest ';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

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
    RegisterButtonComponent,
    AccountDialogComponent,

    /* PrimeNg */
    SidebarModule,
    OverlayPanelModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  accounts!: Account[];
  loading = false;
  mobileQuery: MediaQueryList;

  @ViewChild('accountDialog')
  accountDialog!: AccountDialogComponent;

  constructor(
    private accountService: AccountService,
    media: MediaMatcher,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
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

  openAccountDialog(account?: Account) {
    let dialogData: AccountDialogDataType;

    if (account) {
      dialogData = {
        newAccount: false,
        account,
      };
    } else {
      dialogData = { newAccount: true };
    }

    this.accountDialog.openDialog(dialogData);

    this.accountDialog.closeEvent.subscribe((success: boolean) => {
      if ((success as boolean) === true) {
        this.updatedAccounts();
      }
    });
  }

  deleteAccountConfirm(event: Event, accountId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você quer desativar essa conta?',
      header: 'Desativar Conta',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sim',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      rejectLabel: 'Não',
      acceptIcon: 'none',
      rejectIcon: 'none',
      closeOnEscape: true,

      accept: () => {
        this.accountService.deleteAccount(accountId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Desativada',
              detail: 'Conta Desativada',
              life: 3000,
            });

            this.updatedAccounts();
          },
          error: (err: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'danger',
              summary: 'Desativada',
              detail: 'Erro ao Desativar Conta: ' + err.error,
              life: 3000,
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Desativação cancelada',
          life: 3000,
        });
      },
    });
  }
}
