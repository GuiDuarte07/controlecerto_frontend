import { Component, Input } from '@angular/core';
import { InfoTransactionResponse } from '../../models/InfoTransactionResponse';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TransactionService } from '../../services/transaction.service';
import { CreditCardService } from '../../services/credit-card.service';
import { AccountService } from '../../services/account.service';
import { FormaterService } from '../../services/formater.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateTransactionDialogComponent } from '../dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';

@Component({
  selector: 'app-transaction-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatTooltipModule],
  templateUrl: './transaction-expansion-panel.component.html',
  styleUrl: './transaction-expansion-panel.component.scss',
})
export class TransactionExpansionPanelComponent {
  @Input() transaction!: InfoTransactionResponse;
  @Input() updateTransactions!: () => void;

  constructor(
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    private accountService: AccountService,
    public formaterService: FormaterService,
    public dialog: MatDialog
  ) {}

  openEditTransactionDialog(transaction: InfoTransactionResponse) {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      data: {
        transactionType: transaction.type,
        newTransaction: false,
        transaction,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }

  openDeleteAlertDialog(transaction: InfoTransactionResponse) {
    if (transaction.type === TransactionTypeEnum.CREDITEXPENSE) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Deletar lançamento',
          message: `Você tem certeza que deseja deletar esse lançamento?
                    ${transaction.description}
                     \n* Lembrando que esse processo irá deletar todas as parcelas dessa compra, mas só será possível se nenhuma fatura tiver sido paga ainda.
          `,
          successMessage: 'Lançamento deletado com sucesso!',
          actionButtonMessage: 'Deletar',
          confirmObservable: this.creditCardService.deleteCreditPurchase(
            transaction.creditPurchase!.id!
          ),
        },
      });
      dialogRef.afterClosed().subscribe((sucess) => {
        if ((sucess as boolean) === true) {
          this.updateTransactions();
        }
      });

      return;
    }

    if (transaction.type === TransactionTypeEnum.INVOICEPAYMENT) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Deletar lançamento',
          message: `Você tem certeza que deseja excluir esse pagamento de fatura?
                    \n${transaction.description}
          `,
          successMessage: 'Pagamento deletado com sucesso!',
          actionButtonMessage: 'Deletar',
          confirmObservable: this.creditCardService.deleteInvoicePayment(
            transaction.id
          ),
        },
      });
      dialogRef.afterClosed().subscribe((sucess) => {
        if ((sucess as boolean) === true) {
          this.updateTransactions();
        }
      });

      return;
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Deletar lançamento',
        message: `Você tem certeza que deseja deletar esse lançamento?
                  ${transaction.description}
        `,
        successMessage: 'Lançamento deletado com sucesso!',
        actionButtonMessage: 'Deletar',
        confirmObservable: this.transactionService.deleteTransaction(
          transaction.id
        ),
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateTransactions();
      }
    });
  }
}
