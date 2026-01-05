import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { ResetUserDataRequest } from '../../../models/ResetUserDataRequest';
import { ResetUserDataResponse } from '../../../models/ResetUserDataResponse';

interface IResetForm {
  accounts: FormControl<boolean>;
  transactions: FormControl<boolean>;
  categories: FormControl<boolean>;
  creditCards: FormControl<boolean>;
  invoices: FormControl<boolean>;
  recurringTransactions: FormControl<boolean>;
  notifications: FormControl<boolean>;
  transferences: FormControl<boolean>;
}

@Component({
  selector: 'app-reset-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './reset-user-dialog.component.html',
  styleUrls: ['./reset-user-dialog.component.scss'],
})
export class ResetUserDialogComponent implements OnInit {
  visible = false;
  closeEvent = new EventEmitter<boolean>();

  resetForm!: FormGroup<IResetForm>;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      accounts: new FormControl<boolean>(false, { nonNullable: true }),
      transactions: new FormControl<boolean>(false, { nonNullable: true }),
      categories: new FormControl<boolean>(false, { nonNullable: true }),
      creditCards: new FormControl<boolean>(false, { nonNullable: true }),
      invoices: new FormControl<boolean>(false, { nonNullable: true }),
      recurringTransactions: new FormControl<boolean>(false, {
        nonNullable: true,
      }),
      notifications: new FormControl<boolean>(false, { nonNullable: true }),
      transferences: new FormControl<boolean>(false, { nonNullable: true }),
    });
  }

  openDialog() {
    this.visible = true;
  }

  closeDialog(success: boolean) {
    this.visible = false;
    this.resetForm.reset();
    this.closeEvent.emit(success);
  }

  confirmAndReset() {
    const anySelected = Object.values(this.resetForm.value).some(
      (v) => v === true
    );
    if (!anySelected) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione ao menos um item para resetar',
        life: 3000,
      });
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar Exclusão de Dados',
      message:
        'Os dados selecionados serão permanentemente removidos e não poderão ser recuperados. Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Resetar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.resetUserData(),
      reject: () => {},
    });
  }

  private resetUserData() {
    const request: ResetUserDataRequest = {
      ...this.resetForm.getRawValue(),
    } as ResetUserDataRequest;

    this.userService.resetUserData(request).subscribe({
      next: (res: ResetUserDataResponse) => {
        const details = [];
        if (res.accountsDeleted > 0)
          details.push(`Contas: ${res.accountsDeleted}`);
        if (res.transactionsDeleted > 0)
          details.push(`Transações: ${res.transactionsDeleted}`);
        if (res.categoriesDeleted > 0)
          details.push(`Categorias: ${res.categoriesDeleted}`);
        if (res.creditCardsDeleted > 0)
          details.push(`Cartões de Crédito: ${res.creditCardsDeleted}`);
        if (res.creditPurchasesDeleted > 0)
          details.push(`Compras no Crédito: ${res.creditPurchasesDeleted}`);
        if (res.invoicesDeleted > 0)
          details.push(`Faturas: ${res.invoicesDeleted}`);
        if (res.recurringTransactionsDeleted > 0)
          details.push(
            `Transações Recorrentes: ${res.recurringTransactionsDeleted}`
          );

        const detailMessage =
          details.length > 0 ? details.join('\n') : 'Nenhum dado foi removido';

        this.messageService.add({
          severity: 'success',
          summary: 'Reset concluído com sucesso',
          detail: detailMessage,
          life: 6000,
        });

        this.closeDialog(true);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao resetar dados',
          detail: err.error || 'Ocorreu um erro durante o reset',
          life: 5000,
        });
      },
    });
  }
}
