import { AccountService } from './../../services/account.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit } from '@angular/core';
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
import { Category } from '../../models/Caterogy';
import { CategoryService } from '../../services/category.service';
import { forkJoin } from 'rxjs';

interface IExpenseForm {
  amount: FormControl<number>;
  expenseType: FormControl<ExpenseTypeEnum>;
  purchaseDate: FormControl<Date>;
  destination: FormControl<string>;
  description: FormControl<string>;
  accountId: FormControl<number>;
  categoryId: FormControl<number>;
  justForRecord: FormControl<boolean>;
}

type ExpenseType = { name: string; code: ExpenseTypeEnum; selected: boolean };

@Component({
  selector: 'app-create-expense-modal',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-expense-modal.component.html',
  styleUrl: './create-expense-modal.component.scss',
})
export class CreateExpenseModalComponent implements OnInit {
  expenseForm!: FormGroup<IExpenseForm>;
  accounts: Account[] = [];
  categories: Category[] = [];

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

  ngOnInit(): void {
    this.expenseForm = new FormGroup({
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
      expenseType: new FormControl<ExpenseTypeEnum>(ExpenseTypeEnum.CASH, {
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
      this.expenseForm.patchValue({ accountId: this.accounts[0].id });
    });

    this.categoryService.GetCategories().subscribe((data) => {
      this.categories = data;
      this.expenseForm.patchValue({ categoryId: this.categories[0].id });
    });
  }

  createExpense() {
    if (this.expenseForm.invalid) return;

    const expenseToCreate = new CreateExpense(this.expenseForm.getRawValue());

    console.log(expenseToCreate);

    this.transactionService.createExpense(expenseToCreate);
  }

  cleanForm() {
    this.expenseForm.reset();
  }

  setExpenseType(exptype: ExpenseType) {
    this.expenseTypes.forEach((ep) => {
      ep.selected = false;
      if (ep.code === exptype.code) {
        ep.selected = true;
      }
    });

    this.expenseForm.patchValue({ expenseType: exptype.code });
  }

  setDateOption(opt: number) {
    this.dateOptions.otherdate = false;
    this.dateOptions.today = false;
    this.dateOptions.yesterday = false;
    if (opt === 0) {
      this.dateOptions.today = true;
      this.expenseForm.value.purchaseDate = new Date();
    } else if (opt === 1) {
      this.dateOptions.yesterday = true;
      this.expenseForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    } else if (opt === 2) {
      this.dateOptions.otherdate = true;
      this.expenseForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 3)
      );
    }
  }

  formatedDate() {
    const date = this.expenseForm.value.purchaseDate!;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    // Formata a data como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }
}
