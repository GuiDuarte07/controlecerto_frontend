import { TransactionService } from './../../../services/transaction.service';
import { AccountService } from './../../../services/account.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SelectionComponent } from '../../selection/selection.component';
import { Account } from '../../../models/AccountRequest ';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { CreateTransferenceRequest } from '../../../models/CreateTransferenceRequest';
import { HttpErrorResponse } from '@angular/common/http';

interface ITransferenceForm {
  amount: FormControl<number>;
  description: FormControl<string | null>;
  purchaseDate: FormControl<Date>;
  accountDestinyId: FormControl<number | null>;
  accountOriginId: FormControl<number | null>;
}

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    CurrencyMaskDirective,
    MatDatepickerModule,
    SelectionComponent,
  ],
  providers: [provideNativeDateAdapter(), CurrencyMaskDirective],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss',
})
export class TransferDialogComponent implements OnInit {
  transferForm!: FormGroup<ITransferenceForm>;

  loadingAccounts = true;
  accounts!: Account[];

  selectedAccountOrigin?: Account;
  selectedAccountDestiny?: Account;

  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.transferForm = new FormGroup({
      amount: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }),
      purchaseDate: new FormControl<Date>(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      accountDestinyId: new FormControl<number | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      accountOriginId: new FormControl<number | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.updateAccounts();
  }

  updateAccounts() {
    this.loadingAccounts = true;
    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.loadingAccounts = false;
      console.log(this.loadingAccounts);
    });
  }

  accountsFilteringId(accountId?: number | null) {
    return this.accounts.filter((a) => a.id !== accountId);
  }

  changeSelectedItem(item: Account, option: 'origin' | 'destiny') {
    if (option === 'origin') {
      this.selectedAccountOrigin = item;
      this.transferForm.patchValue({ accountOriginId: item.id });
    } else {
      this.selectedAccountDestiny = item;
      this.transferForm.patchValue({ accountDestinyId: item.id });
    }
  }

  openAccountDialog() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { newAccount: true },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateAccounts();
      }
    });
  }

  closeDialog(sucess: boolean) {
    this.dialogRef.close(sucess);
  }

  createTransference() {
    if (this.transferForm.invalid) return;

    const {
      amount,
      description,
      purchaseDate,
      accountOriginId,
      accountDestinyId,
    } = this.transferForm.value;

    const transferToCreate = new CreateTransferenceRequest(
      amount!,
      description ?? null,
      purchaseDate!,
      accountOriginId!,
      accountDestinyId!
    );

    this.transactionService.createTransference(transferToCreate).subscribe({
      next: () => {
        this.openSnackBar(
          `Transferência da conta ${this.selectedAccountOrigin?.bank} para ${this.selectedAccountDestiny?.bank} realizada!`
        );
        this.transferForm.reset();
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.openSnackBar('Houve um erro ao gerar transferência: ' + err.error);
        console.log(err.error);
      },
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['.snackbar-error'],
    });
  }
}
