import { CreditCardService } from './../../../services/credit-card.service';
import { AccountService } from './../../../services/account.service';
import { TransactionService } from './../../../services/transaction.service';
import {
  Component,
  Inject,
  Input,
  OnInit,
  Renderer2,
  input,
  ɵɵsetComponentScope,
} from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ExpenseTypeEnum } from '../../../enums/ExpenseTypeEnum';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Account } from '../../../models/AccountRequest ';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category.service';
import { forkJoin } from 'rxjs';
import { TransactionTypeEnum } from '../../../enums/TransactionTypeEnum';
import { IncomeTypeEnum } from '../../../enums/IncomeTypeEnum';
import { CreateCreditPurchaseRequest } from '../../../models/CreateCreditPurchaseRequest ';
import { CreditCardInfo } from '../../../models/CreditCardInfo';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateTransactionRequest } from '../../../models/CreateTransaction';

interface ITransactionForm {
  amount: FormControl<number>;
  observations: FormControl<string | null>;
  purchaseDate: FormControl<Date>;
  destination: FormControl<string>;
  description: FormControl<string>;
  accountId: FormControl<number>;
  creditCardId: FormControl<number>;
  categoryId: FormControl<number>;
  justForRecord: FormControl<boolean>;
}

@Component({
  selector: 'app-create-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './create-transaction-dialog.component.html',
  styleUrl: './create-transaction-dialog.component.scss',
})
export class CreateTransactionDialogComponent implements OnInit {
  transactionForm!: FormGroup<ITransactionForm>;

  accounts: Account[] = [];
  categories: Category[] = [];
  creditCards: CreditCardInfo[] = [];
  selectedCategory?: Category;
  selectedAccount?: Account;
  selectedCreditCard?: CreditCardInfo;

  installments = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { transactionType: TransactionTypeEnum },
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CreateTransactionDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  dateOptions = {
    today: true,
    yesterday: false,
    otherdate: false,
  };

  ngOnInit(): void {
    let inicialValueType = 0;

    this.transactionForm = new FormGroup<ITransactionForm>({
      amount: new FormControl<number>(0, {
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
      destination: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      observations: new FormControl<string | null>(null, {
        nonNullable: false,
        validators: [Validators.maxLength(300)],
      }),
      purchaseDate: new FormControl<Date>(new Date(), {
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
      creditCardId: new FormControl<number>(0, {
        nonNullable: true,
      }),
      categoryId: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.transactionForm.patchValue({ accountId: this.accounts[0].id });
      this.selectedAccount = this.accounts[0];
    });

    this.categoryService.GetCategories().subscribe((data) => {
      this.categories = data;
      this.transactionForm.patchValue({ categoryId: this.categories[0].id });
      this.selectedCategory = this.categories[0];
    });

    this.creditCardService.getCreditCards().subscribe((data) => {
      this.creditCards = data;
      this.transactionForm.patchValue({ creditCardId: this.creditCards[0].id });
      this.selectedCreditCard = this.creditCards[0];
    });
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

  changeSelectedItem(item: Category | Account | CreditCardInfo) {
    if (item instanceof Category) {
      this.selectedCategory = item;
      this.transactionForm.patchValue({ categoryId: item.id });
    } else if (item instanceof Account) {
      this.selectedAccount = item;
      this.transactionForm.patchValue({ accountId: item.id });
    } else if (item instanceof CreditCardInfo) {
      this.selectedCreditCard = item;
      this.transactionForm.patchValue({ creditCardId: item.id });
    }
  }

  createTransaction() {
    if (this.transactionForm.invalid) return;

    if (this.data.transactionType === TransactionTypeEnum.CREDITEXPENSE) {
      const {
        amount,
        creditCardId,
        categoryId,
        description,
        destination,
        justForRecord,
        purchaseDate,
      } = this.transactionForm.value;
      const creditPurchaseToCreate = new CreateCreditPurchaseRequest(
        amount!,
        this.installments,
        undefined,
        purchaseDate ?? new Date(),
        destination ?? '',
        description,
        creditCardId!,
        categoryId!
      );

      this.creditCardService
        .createCreditPurchase(creditPurchaseToCreate)
        .subscribe({
          next: () => {
            this.openSnackBar('Despesa de cartão gerada com sucesso!');
            this.transactionForm.reset();
            this.closeDialog(true);
          },
          error: (err: HttpErrorResponse) => {
            this.openSnackBar(
              'Houve um erro na criação dessa despesa: ' + err.error
            );
            console.log(err.error);
          },
        });
    } else {
      const transactionToCreate = new CreateTransactionRequest({
        ...this.transactionForm.getRawValue(),
        observations: this.transactionForm.value.observations ?? undefined,
        type: this.data.transactionType,
      });

      this.transactionService.createTransaction(transactionToCreate).subscribe({
        next: () => {
          this.openSnackBar('Transação gerada com sucesso!');
          this.transactionForm.reset();
          this.closeDialog(true);
        },
        error: (err: HttpErrorResponse) => {
          this.openSnackBar('Erro: ' + err.error);
        },
      });
    }
  }

  cleanForm() {
    this.transactionForm.reset();
  }

  setDateOption(opt: number) {
    this.dateOptions.otherdate = false;
    this.dateOptions.today = false;
    this.dateOptions.yesterday = false;
    if (opt === 0) {
      this.dateOptions.today = true;
      this.transactionForm.value.purchaseDate = new Date();
    } else if (opt === 1) {
      this.dateOptions.yesterday = true;
      this.transactionForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    } else if (opt === 2) {
      this.dateOptions.otherdate = true;
      this.transactionForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 3)
      );
    }
  }

  formatedDate() {
    const date = this.transactionForm.value.purchaseDate!;
    console.log(date);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    // Formata a data como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }
}
