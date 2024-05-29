import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IncomeTypeEnum } from '../../enums/IncomeTypeEnum';
import { Account } from '../../models/AccountRequest ';
import { Category } from '../../models/Category';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { CreateIncome } from '../../models/CreateIncome';
import { ExpenseTypeEnum } from '../../enums/ExpenseTypeEnum';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';

interface IExpenseForm {
  amount: FormControl<number>;
  incomeType: FormControl<IncomeTypeEnum>;
  purchaseDate: FormControl<Date>;
  origin: FormControl<string>;
  description: FormControl<string>;
  accountId: FormControl<number>;
  categoryId: FormControl<number>;
  justForRecord: FormControl<boolean>;
}

type IncomeType = { name: string; code: IncomeTypeEnum; selected: boolean };

@Component({
  selector: 'app-create-income-modal',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-income-modal.component.html',
  styleUrl: './create-income-modal.component.scss',
})
export class CreateIncomeModalComponent {
  incomeForm!: FormGroup<IExpenseForm>;
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

  ngOnInit(): void {
    this.incomeForm = new FormGroup({
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
      origin: new FormControl<string>('', {
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
      incomeType: new FormControl<IncomeTypeEnum>(IncomeTypeEnum.PIX, {
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
      this.incomeForm.patchValue({ accountId: this.accounts[0].id });
    });

    this.categoryService.GetCategories().subscribe((data) => {
      this.categories = data;
      this.incomeForm.patchValue({ categoryId: this.categories[0].id });
    });
  }

  createIncome() {
    if (this.incomeForm.invalid) return;

    const incomeToCreate = new CreateIncome(this.incomeForm.getRawValue());

    console.log(incomeToCreate);

    //this.transactionService.createIncome(incomeToCreate);
  }

  cleanForm() {
    this.incomeForm.reset();
  }

  setExpenseType(inctype: IncomeType) {
    this.incomeTypes.forEach((inc) => {
      inc.selected = false;
      if (inc.code === inctype.code) {
        inc.selected = true;
      }
    });

    this.incomeForm.patchValue({ incomeType: inctype.code });
  }

  setDateOption(opt: number) {
    this.dateOptions.otherdate = false;
    this.dateOptions.today = false;
    this.dateOptions.yesterday = false;
    if (opt === 0) {
      this.dateOptions.today = true;
      this.incomeForm.value.purchaseDate = new Date();
    } else if (opt === 1) {
      this.dateOptions.yesterday = true;
      this.incomeForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 1)
      );
    } else if (opt === 2) {
      this.dateOptions.otherdate = true;
      this.incomeForm.value.purchaseDate = new Date(
        new Date().setDate(new Date().getDate() - 3)
      );
    }
  }

  formatedDate() {
    const date = this.incomeForm.value.purchaseDate!;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    // Formata a data como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }
}
