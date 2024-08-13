import { AccountService } from '../../../services/account.service';
import { Component, OnInit, Inject } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateAccountRequest } from '../../../models/UpdateAccountRequest';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { colorOptions } from '../../../utils/color_options';

type Color = { code: string; selected: boolean };

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
    MatButtonModule,
    MatDialogModule,
    CurrencyMaskDirective,
  ],
  providers: [],
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.scss',
})
export class AccountDialogComponent implements OnInit {
  accountForm!: FormGroup<IAccountForm>;

  defaultColors: Color[] = colorOptions.map((color) => ({
    code: color,
    selected: false,
  }));

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
          validators: [Validators.required],
        }
      ),
      description: new FormControl<string | null>(
        this.data.newAccount ? null : this.data.account.description,
        {
          nonNullable: false,
          validators: [Validators.minLength(3), Validators.maxLength(100)],
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
      let accountToCreate = new Account({
        ...this.accountForm.getRawValue(),
        balance: this.accountForm.value.balance!,
      });
      console.log(accountToCreate);
      this.accountService.createAccount(accountToCreate).subscribe({
        next: () => {
          this.openSnackBar('Conta criada com sucesso!');
          this.accountForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar('Houve um erro na criação da conta: ' + err.error);
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
          this.openSnackBar('Houve um erro na edição da conta: ' + err.error);
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
