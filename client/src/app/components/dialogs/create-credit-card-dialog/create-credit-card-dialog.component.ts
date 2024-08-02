import { CreditCardService } from './../../../services/credit-card.service';
import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/AccountRequest ';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateCreditCardRequest } from '../../../models/CreateCreditCardRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { CreditCardInfo } from '../../../models/CreditCardInfo';
import { UpdateCreditCardRequest } from '../../../models/UpdateCreditCardRequest';

interface ICreditCardForm {
  totalLimit: FormControl<number>;
  description: FormControl<string>;
  dueDay: FormControl<number>;
  closeDay: FormControl<number>;
  accountId: FormControl<number | null>;
}

@Component({
  selector: 'app-create-credit-card-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatInputModule,
    CommonModule,
    CurrencyMaskDirective,
  ],
  providers: [CurrencyMaskDirective],
  templateUrl: './create-credit-card-dialog.component.html',
  styleUrl: './create-credit-card-dialog.component.scss',
})
export class CreateCreditCardDialogComponent implements OnInit {
  creditCardForm!: FormGroup<ICreditCardForm>;
  accounts!: Account[];

  selectedAccount?: Account;
  accountSelection = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data:
      | { newCreditCard: true }
      | {
          newCreditCard: false;
          creditCard: CreditCardInfo;
        },
    private readonly accountService: AccountService,
    private readonly creditCardService: CreditCardService,
    public dialogRef: MatDialogRef<CreateCreditCardDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.creditCardForm = new FormGroup({
      totalLimit: new FormControl<number>(
        this.data.newCreditCard ? 0 : this.data.creditCard.totalLimit,
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }
      ),
      description: new FormControl<string>(
        this.data.newCreditCard ? '' : this.data.creditCard.description,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        }
      ),
      closeDay: new FormControl<number>(
        {
          value: this.data.newCreditCard ? 1 : this.data.creditCard.closeDay,
          disabled: this.data.newCreditCard ? false : true,
        },
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(1),
            Validators.max(20),
          ],
        }
      ),
      dueDay: new FormControl<number>(
        {
          value: this.data.newCreditCard ? 1 : this.data.creditCard.dueDay,
          disabled: this.data.newCreditCard ? false : true,
        },
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(2),
            Validators.max(28),
          ],
        }
      ),
      accountId: new FormControl<number | null>(
        this.data.newCreditCard ? null : this.data.creditCard.account.id,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });

    if (this.data.newCreditCard) {
      this.accountService.getAccountsWithoutCreditCard().subscribe((data) => {
        this.accounts = data;
      });
    } else {
      this.selectedAccount = this.data.creditCard.account;
    }
  }

  changeSelectedItem(item: Account) {
    this.selectedAccount = item;
    this.creditCardForm.patchValue({ accountId: item.id });
  }

  toggleSelection(event: MouseEvent) {
    if (this.data.newCreditCard === false) return;

    event.stopPropagation();
    this.accountSelection.set(!this.accountSelection());

    const closeSelectionOnClick = (event: MouseEvent) => {
      this.accountSelection.set(false);

      window.removeEventListener('click', closeSelectionOnClick);
    };

    if (this.accountSelection()) {
      window.addEventListener('click', closeSelectionOnClick);
    }
  }

  createNewCreditCard() {
    if (this.data.newCreditCard) {
      let creditCardToCreate = new CreateCreditCardRequest({
        ...this.creditCardForm.getRawValue(),
        accountId: this.selectedAccount?.id!,
        usedLimit: 0,
      });
      this.creditCardService.createCreditCard(creditCardToCreate).subscribe({
        next: () => {
          this.openSnackBar('Cartão de Crédito criado com sucesso!');
          this.creditCardForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar('Houve um erro na criação do cartão: ' + err.error);
          console.log(err.error);
        },
      });
    } else {
      let creditCardToUpdate = new UpdateCreditCardRequest({
        id: this.data.creditCard.id,
        description: this.creditCardForm.value.description,
        totalLimit: this.creditCardForm.value.totalLimit,
      });

      this.creditCardService.updateCreditCard(creditCardToUpdate).subscribe({
        next: () => {
          this.openSnackBar('Cartão de Crédito editado com sucesso!');
          this.creditCardForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar('Houve um erro na edição do cartão: ' + err.error);
          console.log(err.error);
        },
      });
    }
  }

  closeDialog(sucess: boolean) {
    this.dialogRef.close(sucess);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['.snackbar-error'],
    });
  }

  cleanForm() {
    this.creditCardForm.reset();
  }
}
