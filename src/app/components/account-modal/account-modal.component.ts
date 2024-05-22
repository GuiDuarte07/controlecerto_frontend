import { AccountService } from './../../services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { AccountTypeEnum } from '../../enums/AccountTypeEnum ';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Account } from '../../models/AccountRequest ';

type Color = { code: string; selected: boolean };
type AccountType = { name: string; code: AccountTypeEnum; selected: boolean };

interface IAccountForm {
  balance: FormControl<number>;
  description: FormControl<string>;
  bank: FormControl<string>;
  accountType: FormControl<AccountTypeEnum>;
  color: FormControl<string>;
}

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss',
})
export class AccountModalComponent implements OnInit {
  @Output() onAccountCreated = new EventEmitter<void>();

  accountForm!: FormGroup<IAccountForm>;

  defaultColors: Color[] = [
    { code: '#FF5733', selected: false },
    { code: '#FFD700', selected: false },
    { code: '#32CD32', selected: false },
    { code: '#4682B4', selected: false },
    { code: '#9400D3', selected: false },
    { code: '#FF1493', selected: false },
    { code: '#00CED1', selected: false },
    { code: '#8A2BE2', selected: false },
    { code: '#F08080', selected: false },
    { code: '#7FFFD4', selected: false },
  ];

  accountTypes: AccountType[] = [
    { name: 'Corrente', code: AccountTypeEnum.CHECKING, selected: true },
    { name: 'Poupança', code: AccountTypeEnum.SAVINGS, selected: false },
    { name: 'Crédito', code: AccountTypeEnum.CREDIT, selected: false },
    { name: 'Investimento', code: AccountTypeEnum.INVESTMENT, selected: false },
    { name: 'Outro', code: AccountTypeEnum.OTHER, selected: false },
  ];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      balance: new FormControl<number>(0, {
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
      bank: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      accountType: new FormControl<AccountTypeEnum>(AccountTypeEnum.CHECKING, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      color: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.setRandomDefaultColor();
  }

  createNewAccount() {
    let accountToCreate = new Account(this.accountForm.getRawValue());
    console.log(accountToCreate);
    this.accountService.createAccount(accountToCreate).subscribe(() => {
      this.accountForm.reset();
      this.onAccountCreated.emit();
    });
  }

  cleanForm() {
    this.accountForm.reset();
  }

  setDefaultColor(color: Color) {
    this.defaultColors.forEach((c) => {
      c.selected = false;
      if (c.code === color.code) {
        c.selected = true;
      }
    });

    this.accountForm.patchValue({ color: color.code });
  }

  resetSelectedColor() {
    this.defaultColors.forEach((c) => (c.selected = true));
  }

  setAccountType(acctype: AccountType) {
    this.accountTypes.forEach((at) => {
      at.selected = false;
      if (at.code === acctype.code) {
        at.selected = true;
      }
    });

    this.accountForm.patchValue({ accountType: acctype.code });
  }

  setRandomDefaultColor() {
    const indiceAleatorio = Math.floor(
      Math.random() * this.defaultColors.length
    );

    this.defaultColors[indiceAleatorio].selected = true;
    this.accountForm.patchValue({
      color: this.defaultColors[indiceAleatorio].code,
    });
  }
}
