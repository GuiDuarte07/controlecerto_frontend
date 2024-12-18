import { Account } from './../../../models/AccountRequest ';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { AccountService } from '../../../services/account.service';
import { InfoInvoiceResponse } from '../../../models/InfoInvoiceResponse';
import { CreateInvoicePaymentRequest } from '../../../models/CreteInvoicePaymentRequest';
import { CreditCardService } from '../../../services/credit-card.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormaterService } from '../../../services/formater.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

export type InvoicePaymentDialogDataType = { invoice: InfoInvoiceResponse };

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
    CurrencyMaskDirective,

    DialogModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [CurrencyMaskDirective, MessageService],
  templateUrl: './invoice-payment-dialog.component.html',
  styleUrl: './invoice-payment-dialog.component.scss',
})
export class InvoicePaymentDialogComponent implements OnInit {
  visible = false;
  closeEvent = new EventEmitter<boolean>();

  data!: InvoicePaymentDialogDataType;
  invoicePaymentForm!: FormGroup<IInvoicePaymentForm>;

  accounts: Account[] = [];
  selectedAccount?: Account;

  constructor(
    private accountService: AccountService,
    private creditCardService: CreditCardService,
    private formaterService: FormaterService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.invoicePaymentForm = new FormGroup({
      amountPaid: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
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

    this.invoicePaymentForm.get('accountId')?.valueChanges.subscribe((id) => {
      this.selectedAccount = this.accounts.find((account) => account.id === id);
    });
  }

  openDialog(data: InvoicePaymentDialogDataType) {
    this.data = data;
    this.visible = true;
    this.invoicePaymentForm.patchValue({
      amountPaid: this.data.invoice.totalAmount - this.data.invoice.totalPaid,
      description: `Pagamento Fatura ${
        this.data.invoice.creditCard.description
      } - ${this.formaterService.getMonthYearString(
        this.data.invoice.closingDate
      )}`,
    });

    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.changeSelectedItem(
        this.accounts.find(
          (a) => a.id === this.data!.invoice.creditCard.account.id
        )!
      );
    });
  }

  closeDialog(success: boolean) {
    this.cleanForm();
    this.visible = false;
    this.closeEvent.emit(success);
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
        this.messageService.add({
          severity: 'success',
          summary: 'Pagamento Efetuado',
          detail: 'Sua fatura foi paga com sucesso!',
          life: 3000,
        });
        this.cleanForm();
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no pagamento da Fatura',
          detail: err.error,
          life: 3000,
        });
      },
    });
  }

  cleanForm() {
    this.invoicePaymentForm.reset();
  }

  changeSelectedItem(item: Account) {
    this.selectedAccount = item;
    this.invoicePaymentForm.patchValue({ accountId: item.id });
  }
}
