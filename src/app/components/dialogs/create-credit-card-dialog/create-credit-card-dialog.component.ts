import { CreditCardService } from './../../../services/credit-card.service';
import {
  Component,
  EventEmitter,
  Inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/AccountRequest ';
import { CommonModule } from '@angular/common';
import { CreateCreditCardRequest } from '../../../models/CreateCreditCardRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { CreditCardInfo } from '../../../models/CreditCardInfo';
import { UpdateCreditCardRequest } from '../../../models/UpdateCreditCardRequest';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

interface ICreditCardForm {
  totalLimit: FormControl<number>;
  description: FormControl<string>;
  dueDay: FormControl<number>;
  closeDay: FormControl<number>;
  accountId: FormControl<number | null>;
  skipWeekend: FormControl<boolean>;
  oneWeekDifference: FormControl<boolean>;
}

@Component({
  selector: 'app-create-credit-card-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CurrencyMaskDirective,
    DialogModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    TooltipModule,
    CheckboxModule,
  ],
  providers: [CurrencyMaskDirective, MessageService],
  templateUrl: './create-credit-card-dialog.component.html',
  styleUrl: './create-credit-card-dialog.component.scss',
})
export class CreateCreditCardDialogComponent implements OnInit {
  data?: CreditCardInfo;
  visible = false;
  closeEvent = new EventEmitter<boolean>();

  creditCardForm!: FormGroup<ICreditCardForm>;
  accounts!: Account[];
  selectedAccount?: Account;

  constructor(
    private readonly accountService: AccountService,
    private readonly creditCardService: CreditCardService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.creditCardForm = new FormGroup({
      totalLimit: new FormControl<number>(0, {
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
      closeDay: new FormControl<number>(1, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(31),
        ],
      }),
      dueDay: new FormControl<number>(8, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(27),
        ],
      }),
      skipWeekend: new FormControl<boolean>(true, {
        nonNullable: true,
      }),
      oneWeekDifference: new FormControl<boolean>(true, {
        nonNullable: true,
      }),
      accountId: new FormControl<number | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  openDialog(data?: CreditCardInfo) {
    console.log(data);
    this.data = data;
    this.visible = true;

    if (this.data) {
      this.creditCardForm.patchValue({
        totalLimit: this.data.totalLimit,
        description: this.data.description,
        closeDay: this.data.closeDay,
        dueDay: this.data.dueDay,
        accountId: this.data.account.id,
      });

      this.creditCardForm.get('accountId')?.disable();
      this.selectedAccount = this.data.account;
      this.accounts = [this.selectedAccount];
    } else {
      this.creditCardForm.get('accountId')?.valueChanges.subscribe((id) => {
        this.selectedAccount =
          this.accounts.find((account) => account.id === id) ?? undefined;
      });
    }

    this.creditCardForm.get('dueDay')?.valueChanges.subscribe((value) => {
      if (this.creditCardForm.value.oneWeekDifference) {
        let closeDay = value - 7;
        closeDay = closeDay <= 0 ? closeDay + 30 : closeDay;
        this.creditCardForm.patchValue({ closeDay });
      }
    });

    this.creditCardForm.get('closeDay')?.disable();

    this.creditCardForm
      .get('oneWeekDifference')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.creditCardForm.get('closeDay')?.disable();
          this.creditCardForm.patchValue({
            closeDay: Math.abs(this.creditCardForm.value.dueDay! - 7) % 30,
          });
        } else {
          this.creditCardForm.get('closeDay')?.enable();
        }
      });

    this.updateAccounts();
  }

  updateAccounts() {
    if (!this.data) {
      this.accountService.getAccountsWithoutCreditCard().subscribe((data) => {
        this.accounts = data;
      });
    } else {
      this.selectedAccount = this.data.account;
    }
  }

  createCreditCard() {
    if (!this.data) {
      let creditCardToCreate = new CreateCreditCardRequest({
        ...this.creditCardForm.getRawValue(),
        accountId: this.selectedAccount?.id!,
        usedLimit: 0,
      });
      this.creditCardService.createCreditCard(creditCardToCreate).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cartão Criado',
            detail: 'Cartão de Crédito criado com sucesso!',
            life: 3000,
          });
          this.creditCardForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error,
            life: 3000,
          });
        },
      });
    } else {
      let creditCardToUpdate = new UpdateCreditCardRequest({
        id: this.data.id,
        description: this.creditCardForm.value.description,
        totalLimit: this.creditCardForm.value.totalLimit,
      });

      this.creditCardService.updateCreditCard(creditCardToUpdate).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cartão Editado',
            detail: 'Cartão de Crédito editado com sucesso!',
            life: 3000,
          });
          this.creditCardForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error,
            life: 3000,
          });
        },
      });
    }
  }

  closeDialog(success: boolean) {
    this.cleanForm();
    this.visible = false;
    this.closeEvent.emit(success);
  }

  cleanForm() {
    this.creditCardForm.reset();
  }

  openAccountDialog() {
    /* const dialogRef = this.dialog.open(AccountDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { newAccount: true },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateAccounts();
      }
    }); */
  }
}
