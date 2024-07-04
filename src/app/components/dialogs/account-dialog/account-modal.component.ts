import { AccountService } from '../../../services/account.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { AccountTypeEnum } from '../../../enums/AccountTypeEnum ';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Account } from '../../../models/AccountRequest ';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateAccountRequest } from '../../../models/UpdateAccountRequest';

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
  selector: 'app-account-dialog',
  standalone: true,
  imports: [
    ModalComponent,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss',
})
export class AccountDialogComponent implements OnInit {
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data:
      | {
          newAccount: true;
        }
      | {
          newAccount: false;
          account: Account;
        },
    private accountService: AccountService,
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      balance: new FormControl<number>(
        this.data.newAccount ? 0 : this.data.account.balance,
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }
      ),
      description: new FormControl<string>(
        this.data.newAccount ? '' : this.data.account.description,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        }
      ),
      bank: new FormControl<string>(
        this.data.newAccount ? '' : this.data.account.bank,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        }
      ),
      accountType: new FormControl<AccountTypeEnum>(
        this.data.newAccount
          ? AccountTypeEnum.CHECKING
          : this.data.account.accountType,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      color: new FormControl<string>(
        this.data.newAccount ? '' : this.data.account.color,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });

    this.setRandomDefaultColor();
  }

  createNewAccount() {
    if (this.data.newAccount) {
      let accountToCreate = new Account(this.accountForm.getRawValue());
      console.log(accountToCreate);
      this.accountService.createAccount(accountToCreate).subscribe({
        next: () => {
          this.openSnackBar('Conta criada com sucesso!');
          this.accountForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar(
            'Houve um erro na criação da conta: ' + err.message
          );
        },
      });
    } else {
      let accountToUpdate = new UpdateAccountRequest({
        id: this.data.account.id!,
        ...this.accountForm.getRawValue(),
      });
      console.log(accountToUpdate);
      this.accountService.updateAccount(accountToUpdate).subscribe({
        next: () => {
          this.openSnackBar('Conta editada com sucesso!');
          this.accountForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar('Houve um erro na edição da conta: ' + err.message);
        },
      });
    }
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
    if (this.data.newAccount) {
      const indiceAleatorio = Math.floor(
        Math.random() * this.defaultColors.length
      );

      this.defaultColors[indiceAleatorio].selected = true;
      this.accountForm.patchValue({
        color: this.defaultColors[indiceAleatorio].code,
      });
    } else {
      for (let i = 0; i < this.defaultColors.length; i++) {
        if (this.defaultColors[i].code === this.data.account.color) {
          this.defaultColors[i].selected = true;
          this.accountForm.patchValue({
            color: this.defaultColors[i].code,
          });
          break;
        }
      }
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
}
