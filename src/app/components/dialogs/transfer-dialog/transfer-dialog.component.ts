import { TransactionService } from './../../../services/transaction.service';
import { AccountService } from './../../../services/account.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Account } from '../../../models/AccountRequest ';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { CreateTransferenceRequest } from '../../../models/CreateTransferenceRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { differentAccountsValidator } from '../../../validators/differentAccountsValidator';

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
    CurrencyMaskDirective,
    DialogModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    CurrencyMaskDirective,
    MessageService,
  ],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss',
})
export class TransferDialogComponent implements OnInit {
  transferForm!: FormGroup<ITransferenceForm>;

  loadingAccounts = true;
  accounts!: Account[];

  closeEvent = new EventEmitter<boolean>();
  visible = false;

  selectedAccountOrigin?: Account;
  selectedAccountDestiny?: Account;

  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.transferForm = new FormGroup(
      {
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
      },
      { validators: differentAccountsValidator() }
    );

    this.transferForm.get('accountOriginId')?.valueChanges.subscribe((id) => {
      this.selectedAccountOrigin = this.accounts.find(
        (account) => account.id === id
      );
    });

    this.transferForm.get('accountDestinyId')?.valueChanges.subscribe((id) => {
      this.selectedAccountDestiny = this.accounts.find(
        (account) => account.id === id
      );
    });
  }

  openDialog() {
    this.visible = true;
    this.updateAccounts();
  }

  closeDialog(success: boolean) {
    this.visible = false;
    this.transferForm.reset();
    this.closeEvent.emit(success);
  }

  updateAccounts() {
    this.loadingAccounts = true;
    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.loadingAccounts = false;
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

  /* openAccountDialog() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { newAccount: true },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateAccounts();
      }
    });
  } */

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
        this.messageService.add({
          severity: 'success',
          summary: 'Transferência concluida!',
          detail: `Transferência da conta ${this.selectedAccountOrigin?.bank} para ${this.selectedAccountDestiny?.bank} realizada.`,
          life: 3000,
        });
        this.transferForm.reset();
        this.closeDialog(true);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na Transferência',
          detail: err.error,
          life: 3000,
        });
      },
    });
  }
}
