import { ToastService } from './../../../services/toast.service';
import { AccountService } from '../../../services/account.service';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Account } from '../../../models/AccountRequest ';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateAccountRequest } from '../../../models/UpdateAccountRequest';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { colorOptions } from '../../../utils/color_options';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export type AccountDialogDataType =
  | {
      newAccount: true;
    }
  | {
      newAccount: false;
      account: Account;
    };

interface IAccountForm {
  balance: FormControl<number>;
  description: FormControl<string | null>;
  bank: FormControl<string>;
  color: FormControl<string>;
}

@Component({
  selector: 'app-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyMaskDirective,

    /* PrimeNg */
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    OverlayPanelModule,
    ColorPickerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './account-dialog.component.html',
  styleUrl: './account-dialog.component.scss',
})
export class AccountDialogComponent implements OnInit {
  visible = false;
  closeEvent = new EventEmitter<boolean>();

  data: AccountDialogDataType | null = null;
  accountForm!: FormGroup<IAccountForm>;

  defaultColors: string[] = colorOptions;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      balance: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }),
      bank: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      color: new FormControl<string>(this.defaultColors[0], {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  openDialog(data: AccountDialogDataType) {
    this.data = data;
    this.visible = true;

    if (!data.newAccount) {
      this.accountForm.patchValue({
        balance: this.data.newAccount ? 0 : this.data.account.balance,
        description: this.data.newAccount
          ? null
          : this.data.account.description,
        bank: this.data.newAccount ? '' : this.data.account.bank,
        color: this.data.newAccount
          ? this.defaultColors[0]
          : this.data.account.color,
      });
    }
  }

  closeDialog(success: boolean) {
    this.cleanForm();
    this.visible = false;
    this.closeEvent.emit(success);
  }

  createNewAccount() {
    if (this.data!.newAccount) {
      let accountToCreate = new Account({
        ...this.accountForm.getRawValue(),
        balance: this.accountForm.value.balance!,
      });
      this.accountService.createAccount(accountToCreate).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Conta Criada',
            detail: 'Conta criada com sucesso!',
            life: 3000,
          });
          this.accountForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Houve um Erro',
            detail: 'Houve um erro na criação da conta: ' + err.error,
            life: 3000,
          });
        },
      });
    } else {
      let accountToUpdate = new UpdateAccountRequest({
        id: this.data!.account.id!,
        ...this.accountForm.getRawValue(),
      });
      this.accountService.updateAccount(accountToUpdate).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Conta Atualizada',
            detail: 'Conta editada com sucesso!',
            life: 3000,
          });
          this.accountForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Houve um Erro',
            detail: 'Houve um erro na edição da conta: ' + err.error,
            life: 3000,
          });
        },
      });
    }
  }

  cleanForm() {
    this.accountForm.reset();
  }

  setDefaultColor(color: string) {
    this.accountForm.patchValue({ color });
  }
}
