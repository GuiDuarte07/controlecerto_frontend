import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TransactionService } from '../../services/transaction.service';
import { CreditCardService } from '../../services/credit-card.service';
import { AccountService } from '../../services/account.service';
import { FormaterService } from '../../services/formater.service';
import { CreateTransactionDialogComponent } from '../dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { transactionTypeToText } from '../../utils/formaters';
import {
  TransactionDialogComponent,
  TransactionDialogDataType,
} from '../dialogs/transaction-dialog/transaction-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-transaction-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    CommonModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    ButtonGroupModule,
    TransactionDialogComponent,
    ConfirmDialogModule,
    ToastModule,
    MatCheckboxModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './transaction-expansion-panel.component.html',
  styleUrl: './transaction-expansion-panel.component.scss',
})
export class TransactionExpansionPanelComponent {
  fullLoadScreen = signal(false);

  @ViewChild('transactionDialog')
  transactionDialog!: TransactionDialogComponent;

  @Input() transaction!: InfoTransactionResponse;
  @Input() updateTransactions!: () => void;

  @Input() selectMode: boolean = false;
  @Input() checked: boolean = false;
  @Output() checkedEvent = new EventEmitter<{
    transaction: InfoTransactionResponse;
    checked: boolean;
  }>();

  sidebarVisible: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    public formaterService: FormaterService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  toggleCheckedStatus() {
    this.checked = !this.checked;
    this.checkedEvent.emit({
      transaction: this.transaction,
      checked: this.checked,
    });
  }

  toggleSidebarVisible() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  openEditTransactionDialog(transaction: InfoTransactionResponse) {
    const dialogData: TransactionDialogDataType = {
      newTransaction: false,
      transactionType: transaction.type,
      transaction,
    };

    this.transactionDialog.openDialog(dialogData);
    this.transactionDialog.closeEvent.subscribe((success: boolean) => {
      if (success === true) {
        this.updateTransactions();
      }
    });
  }

  deleteTransaction(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Deletar Transação',
      message: `Deseja deletar essa transação?`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Deletar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.fullLoadScreen.set(true);

        if (this.transaction.type !== TransactionTypeEnum.CREDITEXPENSE) {
          this.transactionService
            .deleteTransaction(this.transaction.id)
            .subscribe({
              next: () => {
                this.sidebarVisible = false;
                this.fullLoadScreen.set(false);

                this.messageService.add({
                  severity: 'success',
                  summary: 'Deletado',
                  detail: 'Transação deletada com sucesso!',
                  life: 3000,
                });

                this.updateTransactions();
              },
              error: (error: HttpErrorResponse) => {
                this.fullLoadScreen.set(false);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro ao Deletar',
                  detail: error.error,
                  life: 3000,
                });
              },
            });
        } else {
          this.creditCardService
            .deleteCreditPurchase(this.transaction?.creditPurchase?.id!)
            .subscribe({
              next: () => {
                this.sidebarVisible = false;
                this.fullLoadScreen.set(false);

                this.messageService.add({
                  severity: 'success',
                  summary: 'Deletado',
                  detail: 'Transação deletada com sucesso!',
                  life: 3000,
                });

                this.updateTransactions();
              },
              error: (error: HttpErrorResponse) => {
                this.fullLoadScreen.set(false);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro ao Deletar',
                  detail: error.error,
                  life: 3000,
                });
              },
            });
        }
      },
    });
  }

  transactionTypeToText(transactionType: TransactionTypeEnum) {
    return transactionTypeToText(transactionType);
  }
}
