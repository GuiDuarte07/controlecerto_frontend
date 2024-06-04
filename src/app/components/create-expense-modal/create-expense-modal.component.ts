import { AccountService } from './../../services/account.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, Input, OnInit, input } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ExpenseTypeEnum } from '../../enums/ExpenseTypeEnum';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateExpense } from '../../models/CreateExpense';
import { Account } from '../../models/AccountRequest ';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { forkJoin } from 'rxjs';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';
import { IncomeTypeEnum } from '../../enums/IncomeTypeEnum';
import { CreateIncome } from '../../models/CreateIncome';

interface ITransactionForm {
  amount: FormControl<number>;
  expenseType: FormControl<number>;
  purchaseDate: FormControl<Date>;
  destination: FormControl<string>;
  description: FormControl<string>;
  accountId: FormControl<number>;
  categoryId: FormControl<number>;
  justForRecord: FormControl<boolean>;
}

type ExpenseType = { name: string; code: ExpenseTypeEnum; selected: boolean };
type IncomeType = { name: string; code: IncomeTypeEnum; selected: boolean };

@Component({
  selector: 'app-create-expense-modal',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-expense-modal.component.html',
  styleUrl: './create-expense-modal.component.scss',
})
export class CreateExpenseModalComponent implements OnInit {
  @Input() transactionType!: TransactionTypeEnum;
  @Input() id!: string;

  transactionForm!: FormGroup<ITransactionForm>;

  accounts: Account[] = [];
  categories: Category[] = [];
  selectedCategory!: Category;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService
  ) {}

  dateOptions = {
    today: true,
    yesterday: false,
    otherdate: false,
  };

  expenseTypes: ExpenseType[] = [
    { name: 'PIX', code: ExpenseTypeEnum.PIX, selected: true },
    { name: 'Dinheiro', code: ExpenseTypeEnum.CASH, selected: false },
    { name: 'Cheque', code: ExpenseTypeEnum.CHECK, selected: false },
    {
      name: 'Cartão de débito',
      code: ExpenseTypeEnum.DEBIT_CARD,
      selected: false,
    },
    { name: 'Outro', code: ExpenseTypeEnum.OTHER, selected: false },
  ];

  incomeTypes: IncomeType[] = [
    { name: 'PIX', code: IncomeTypeEnum.PIX, selected: true },
    { name: 'Dinheiro', code: IncomeTypeEnum.CASH, selected: false },
    { name: 'Cheque', code: IncomeTypeEnum.CHECK, selected: false },
    {
      name: 'Cartão de débito',
      code: IncomeTypeEnum.DEBIT_CARD,
      selected: false,
    },
    { name: 'Depósito', code: IncomeTypeEnum.DEPOSIT, selected: false },
    { name: 'Juros', code: IncomeTypeEnum.INTEREST, selected: false },
    { name: 'Dividendo', code: IncomeTypeEnum.DIVIDEND, selected: false },
    { name: 'Reembolso', code: IncomeTypeEnum.REFUND, selected: false },
    { name: 'Outro', code: IncomeTypeEnum.OTHER, selected: false },
  ];

  getTypes(): IncomeType[] | ExpenseType[] {
    if (this.transactionType === TransactionTypeEnum.INCOME) {
      return this.incomeTypes;
    }
    return this.expenseTypes;
  }

  ngOnInit(): void {
    let inicialValueType = 0;
    if (this.transactionType === TransactionTypeEnum.INCOME) {
      inicialValueType = IncomeTypeEnum.PIX;
    } else {
      inicialValueType = ExpenseTypeEnum.PIX;
    }

    this.transactionForm = new FormGroup({
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
      accountId: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      categoryId: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      expenseType: new FormControl<number>(inicialValueType, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      justForRecord: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      purchaseDate: new FormControl<Date>(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.accountService.getAccounts().subscribe((data) => {
      this.accounts = data;
      this.transactionForm.patchValue({ accountId: this.accounts[0].id });
    });

    this.categoryService.GetCategories().subscribe((data) => {
      this.categories = data;
      this.transactionForm.patchValue({ categoryId: this.categories[0].id });
      this.selectedCategory = this.categories[0];
    });
  }

  changeSelectedCategory(category: Category) {
    this.selectedCategory = category;
    this.transactionForm.patchValue({ categoryId: category.id });
  }

  createTransaction() {
    if (this.transactionForm.invalid) return;

    if (this.transactionType === TransactionTypeEnum.INCOME) {
      let data = this.transactionForm.getRawValue();
      const incomeToCreate = new CreateIncome({
        accountId: data.accountId,
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        incomeType: data.expenseType as IncomeTypeEnum,
        justForRecord: data.justForRecord,
        origin: data.description,
        purchaseDate: data.purchaseDate,
      });
      console.log(incomeToCreate);
      //this.transactionService.createIncome(incomeToCreate);
    }

    if (this.transactionType === TransactionTypeEnum.EXPENSE) {
      const expenseToCreate = new CreateExpense(
        this.transactionForm.getRawValue()
      );
      console.log(expenseToCreate);
      this.transactionService.createExpense(expenseToCreate);
    }
  }

  cleanForm() {
    this.transactionForm.reset();
  }

  setExpenseType(exptype: ExpenseType | IncomeType) {
    if (this.transactionType === TransactionTypeEnum.INCOME) {
      this.incomeTypes.forEach((inc) => {
        inc.selected = false;
        if (inc.code === exptype.code) {
          inc.selected = true;
        }
      });

      this.transactionForm.patchValue({ expenseType: exptype.code });
    }

    if (this.transactionType === TransactionTypeEnum.EXPENSE) {
      this.expenseTypes.forEach((ep) => {
        ep.selected = false;
        if (ep.code === exptype.code) {
          ep.selected = true;
        }
      });

      this.transactionForm.patchValue({ expenseType: exptype.code });
    }
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

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    // Formata a data como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }
}
