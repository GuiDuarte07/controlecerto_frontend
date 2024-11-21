import { CreditCardService } from './../../../services/credit-card.service';
import { AccountService } from './../../../services/account.service';
import { TransactionService } from './../../../services/transaction.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
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
import { TransactionTypeEnum } from '../../../enums/TransactionTypeEnum';
import { CreateCreditPurchaseRequest } from '../../../models/CreateCreditPurchaseRequest ';
import { CreditCardInfo } from '../../../models/CreditCardInfo';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateTransactionRequest } from '../../../models/CreateTransaction';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BillTypeEnum } from '../../../enums/BillTypeEnum';
import { InfoTransactionResponse } from '../../../models/InfoTransactionResponse';
import { UpdateTransactionRequest } from '../../../models/UpdateTransaction';
import { UpdateCreditPurchaseRequest } from '../../../models/UpdateCreditPurchaseRequest';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { CreateCreditCardDialogComponent } from '../create-credit-card-dialog/create-credit-card-dialog.component';
import { SelectionComponent } from '../../selection/selection.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

export type TransactionDialogDataType =
  | { newTransaction: true; transactionType: TransactionTypeEnum }
  | {
      newTransaction: false;
      transactionType: TransactionTypeEnum;
      transaction: InfoTransactionResponse;
    };

interface ITransactionForm {
  amount: FormControl<number>;
  observations: FormControl<string | undefined>;
  purchaseDate: FormControl<Date>;
  destination: FormControl<string>;
  description: FormControl<string>;
  accountId: FormControl<number>;
  creditCardId: FormControl<number>;
  categoryId: FormControl<number>;
  justForRecord: FormControl<boolean>;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CurrencyMaskDirective,
    SelectionComponent,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    InputNumberModule,
  ],
  providers: [provideNativeDateAdapter(), CurrencyMaskDirective],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
})
export class TransactionDialogComponent implements OnInit {
  data: TransactionDialogDataType | null = null;

  closeEvent = new EventEmitter<boolean>();

  visible = false;

  transactionForm!: FormGroup<ITransactionForm>;
  datepicker = new Date();

  accounts: Account[] = [];
  creditCards: CreditCardInfo[] = [];
  selectedAccount?: Account;
  selectedCreditCard?: CreditCardInfo;

  categories: Category[] = [];
  selectedCategory?: Category;

  installments!: number;
  amountPerInstallment!: number;

  constructor(
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    console.log(this.data);
  }

  ngOnInit(): void {
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
      observations: new FormControl<string | undefined>(undefined, {
        nonNullable: true,
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
        validators: [Validators.required],
      }),
      creditCardId: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categoryId: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
    });

    this.transactionForm.get('categoryId')?.valueChanges.subscribe((id) => {
      this.selectedCategory = this.categories.find(
        (category) => category.id === id
      );
    });

    this.transactionForm.get('accountId')?.valueChanges.subscribe((id) => {
      this.selectedAccount = this.accounts.find((account) => account.id === id);
    });

    this.transactionForm.get('creditCardId')?.valueChanges.subscribe((id) => {
      this.selectedCreditCard = this.creditCards.find(
        (creditCard) => creditCard.id === id
      );
    });
  }

  openDialog(data: TransactionDialogDataType) {
    this.data = data;
    this.visible = true;
    this.installments = 1;
    this.amountPerInstallment = 0;

    this.transactionForm.patchValue({
      amount: this.data.newTransaction
        ? 0
        : this.data.transaction.type === TransactionTypeEnum.CREDITEXPENSE
        ? this.data.transaction.creditPurchase!.totalAmount
        : this.data.transaction.amount,
      description: this.data.newTransaction
        ? ''
        : this.data.transaction.type === TransactionTypeEnum.CREDITEXPENSE
        ? this.data.transaction.creditPurchase?.description!
        : this.data.transaction.description,
      destination: this.data.newTransaction
        ? ''
        : this.data.transaction.destination ?? '',
      observations: this.data.newTransaction
        ? undefined
        : this.data.transaction.observations,
      purchaseDate: this.data.newTransaction
        ? new Date()
        : this.data.transactionType === TransactionTypeEnum.CREDITEXPENSE
        ? new Date(this.data.transaction.creditPurchase?.purchaseDate!)
        : new Date(this.data.transaction.purchaseDate),
      justForRecord: this.data.newTransaction
        ? false
        : this.data.transaction.justForRecord,
      accountId: this.data.newTransaction
        ? 0
        : this.data.transaction.account.id,
      categoryId: this.data.newTransaction
        ? 0
        : this.data.transaction.category!.id!,
    });

    this.updateAccounts();

    this.updateCategories();

    this.updateCreditCards();
  }

  closeDialog(success: boolean) {
    this.visible = false;
    this.transactionForm.reset();
    this.closeEvent.emit(success);
  }

  isFormInvalid(): boolean {
    if (!this.transactionForm.invalid) {
      if (
        this.data?.transactionType !== TransactionTypeEnum.CREDITEXPENSE &&
        this.transactionForm.value.accountId! > 0
      ) {
        return false;
      } else if (
        this.data?.transactionType === TransactionTypeEnum.CREDITEXPENSE &&
        this.transactionForm.value.creditCardId! > 0
      ) {
        return false;
      }
    }

    return true;
  }

  getDialogTitle() {
    if (!this.data) return 'Carregando';

    if (this.data.newTransaction && this.data.transactionType === 0)
      return 'Nova Despesa';

    if (this.data.newTransaction && this.data.transactionType === 1)
      return 'Nova Receita';

    if (this.data.newTransaction && this.data.transactionType === 2)
      return 'Nova Despesa Cartão';

    if (!this.data.newTransaction && this.data.transactionType === 0)
      return 'Editar Despesa';

    if (!this.data.newTransaction && this.data.transactionType === 1)
      return 'Editar Receita';

    if (!this.data.newTransaction && this.data.transactionType === 2)
      return 'Editar Despesa Cartão';

    return 'Transação';
  }

  updateCreditCards() {
    if (this.data!.transactionType === TransactionTypeEnum.CREDITEXPENSE) {
      if (!this.data!.newTransaction) {
        this.installments =
          this.data!.transaction.creditPurchase?.totalInstallment!;
        this.changeAmountPerInstallment();
      }

      this.creditCardService.getCreditCards().subscribe((data) => {
        this.creditCards = data;
        if (this.data!.newTransaction === false) {
          let id = this.data!.transaction.creditPurchase!.creditCardId;
          this.selectedCreditCard = this.creditCards.find((a) => a.id! === id);
          this.transactionForm.patchValue({
            creditCardId: this.selectedCreditCard!.id,
          });
        }
      });
    }
  }

  updateCategories() {
    // Tipo da categoria
    const categoryType =
      this.data!.transactionType === TransactionTypeEnum.INCOME
        ? BillTypeEnum.INCOME
        : BillTypeEnum.EXPENSE;

    // Puxando as categorias
    this.categoryService.GetCategories(categoryType).subscribe((categories) => {
      this.categories = categories;
      console.log(categories);
      //this.categories = categories.filter((c) => c.billType === categoryType);
      if (this.data!.newTransaction === false) {
        let id = this.data!.transaction.category!.id;
        this.selectedCategory = this.categories.find((a) => a.id! === id);
      }
    });
  }

  updateAccounts() {
    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      if (this.data!.newTransaction === false) {
        let id = this.data!.transaction.account.id;
        this.selectedAccount = this.accounts.find((a) => a.id! === id);
      }
    });
  }

  changeAmountPerInstallment() {
    this.amountPerInstallment =
      this.transactionForm.value.amount! / this.installments;
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
    if (this.data === null) return;

    // Nova transação Cartão
    if (
      this.data.transactionType === TransactionTypeEnum.CREDITEXPENSE &&
      this.data.newTransaction
    ) {
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
      console.log(creditPurchaseToCreate);
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
    }

    // Atualizar transação Cartão
    if (
      this.data.transactionType === TransactionTypeEnum.CREDITEXPENSE &&
      !this.data.newTransaction
    ) {
      const creditPurchaseToUpdate = new UpdateCreditPurchaseRequest({
        id: this.data.transaction.creditPurchase!.id!,
        ...this.transactionForm.getRawValue(),
        totalAmount: this.transactionForm.value.amount,
        totalInstallment: this.installments,
      });

      this.creditCardService
        .updateCreditPurchase(creditPurchaseToUpdate)
        .subscribe({
          next: () => {
            this.openSnackBar('Despesa de cartão atualizada com sucesso!');
            this.transactionForm.reset();
            this.closeDialog(true);
          },
          error: (err: HttpErrorResponse) => {
            this.openSnackBar(
              'Houve um erro na atualização dessa despesa: ' + err.error
            );
            console.log(err.error);
          },
        });
    }

    // Nova transação
    if (
      (this.data.transactionType === TransactionTypeEnum.EXPENSE ||
        this.data.transactionType === TransactionTypeEnum.INCOME) &&
      this.data.newTransaction
    ) {
      const transactionToCreate = new CreateTransactionRequest({
        ...this.transactionForm.getRawValue(),
        type: this.data.transactionType,
      });

      console.log(transactionToCreate);

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

    // Atualizar transação
    if (
      (this.data.transactionType === TransactionTypeEnum.EXPENSE ||
        this.data.transactionType === TransactionTypeEnum.INCOME) &&
      !this.data.newTransaction
    ) {
      const transactionToUpdate = new UpdateTransactionRequest({
        id: this.data.transaction.id,
        ...this.transactionForm.getRawValue(),
      });

      this.transactionService.updateTransaction(transactionToUpdate).subscribe({
        next: () => {
          this.openSnackBar('Transação editada com sucesso!');
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

  formatedDate() {
    const date = this.transactionForm.value.purchaseDate!;
    console.log(date);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    // Formata a data como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }

  /* Criar nova conta ou cartão */
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

  openCreditCardDialog() {
    /* const dialogRef = this.dialog.open(CreateCreditCardDialogComponent, {
      data: {
        newCreditCard: true,
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateCreditCards();
      }
    }); */
  }
}
