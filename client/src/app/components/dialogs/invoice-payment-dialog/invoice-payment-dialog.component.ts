import { Account } from './../../../models/AccountRequest ';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AccountService } from '../../../services/account.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { InfoInvoiceResponse } from '../../../models/InfoInvoiceResponse';
import { CreateInvoicePaymentRequest } from '../../../models/CreteInvoicePaymentRequest';
import { CreditCardService } from '../../../services/credit-card.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormaterService } from '../../../services/formater.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface IInvoicePaymentForm {
  amountPaid: FormControl<number>;
  description: FormControl<string>;
  paymentDate: FormControl<Date>;
  justForRecord: FormControl<boolean>;
  accountId: FormControl<number>;
}

@Component({
  selector: 'app-invoice-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    CurrencyMaskDirective,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
  providers: [provideNativeDateAdapter(), CurrencyMaskDirective],
  templateUrl: './invoice-payment-dialog.component.html',
  styleUrl: './invoice-payment-dialog.component.scss',
})
export class InvoicePaymentDialogComponent implements OnInit {
  invoicePaymentForm!: FormGroup<IInvoicePaymentForm>;

  accountSelection = signal(false);
  accounts: Account[] = [];
  selectedAccount?: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { invoice: InfoInvoiceResponse },
    private accountService: AccountService,
    private creditCardService: CreditCardService,
    private formaterService: FormaterService,
    public dialogRef: MatDialogRef<InvoicePaymentDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.invoicePaymentForm = new FormGroup({
      amountPaid: new FormControl<number>(
        this.data.invoice.totalAmount - this.data.invoice.totalPaid,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl<string>(
        `Pagamento Fatura ${
          this.data.invoice.creditCard.description
        } - ${this.formaterService.getMonthYearString(
          this.data.invoice.closingDate
        )}`,
        {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(100)],
        }
      ),
      paymentDate: new FormControl<Date>(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      justForRecord: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      accountId: new FormControl<number>(0, {
        nonNullable: true,
      }),
    });

    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.changeSelectedItem(
        this.accounts.find(
          (a) => a.id === this.data.invoice.creditCard.account.id
        )!
      );
    });
  }

  payInvoice() {
    if (this.invoicePaymentForm.invalid) return;

    const invoicePayment = new CreateInvoicePaymentRequest(
      this.invoicePaymentForm.value.amountPaid!,
      this.invoicePaymentForm.value.description!,
      this.invoicePaymentForm.value.paymentDate!,
      this.data.invoice.id,
      this.invoicePaymentForm.value.accountId!,
      this.invoicePaymentForm.value.justForRecord
    );

    this.creditCardService.payInvoice(invoicePayment).subscribe({
      next: () => {
        this.openSnackBar('Pagamento efetuaddo com sucesso!');
        this.cleanForm();
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.openSnackBar('Erro: ' + err.error);
      },
    });
  }

  cleanForm() {
    this.invoicePaymentForm.reset();
  }

  toggleSelection(event: MouseEvent) {
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

  changeSelectedItem(item: Account) {
    this.selectedAccount = item;
    this.invoicePaymentForm.patchValue({ accountId: item.id });
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
}
