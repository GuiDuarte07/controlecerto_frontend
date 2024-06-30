import { CreditCardService } from './../../../services/credit-card.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
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

interface ICreditCardForm {
  totalLimit: FormControl<number>;
  usedLimit: FormControl<number>;
  description: FormControl<string>;
  cardBrand: FormControl<string>;
  dueDay: FormControl<number>;
  closeDay: FormControl<number>;
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
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './create-credit-card-dialog.component.html',
  styleUrl: './create-credit-card-dialog.component.scss',
})
export class CreateCreditCardDialogComponent implements OnInit {
  creditCardForm!: FormGroup<ICreditCardForm>;
  accounts!: Account[];
  selectedAccountId!: number;

  constructor(
    private readonly accountService: AccountService,
    private readonly creditCardService: CreditCardService,
    public dialogRef: MatDialogRef<CreateCreditCardDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.creditCardForm = new FormGroup({
      totalLimit: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      usedLimit: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      cardBrand: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      closeDay: new FormControl<number>(1, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(20),
        ],
      }),
      dueDay: new FormControl<number>(7, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(28),
        ],
      }),
    });

    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.selectedAccountId = this.accounts[0].id!;
    });
  }

  closeDialog(sucess: boolean) {
    this.dialogRef.close(sucess);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'start',
      verticalPosition: 'top',
      panelClass: ['.snackbar-error'],
    });
  }

  cleanForm() {
    this.creditCardForm.reset();
  }

  createNewCreditCard() {
    console.log(this.selectedAccountId);
    console.log(this.accounts);
    let creditCardToCreate = new CreateCreditCardRequest({
      ...this.creditCardForm.getRawValue(),
      accountId: this.selectedAccountId,
    });
    console.log(creditCardToCreate);
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
  }
}
