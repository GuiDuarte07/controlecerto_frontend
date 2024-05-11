import { ExpenseTypeEnum } from '../enums/ExpenseTypeEnum';

type ExpenseType = {
  amount: number;
  expenseType: ExpenseTypeEnum;
  purchaseDate: Date;
  destination: string;
  description: string | undefined;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;
};

export class CreateExpense {
  amount: number;
  expenseType: ExpenseTypeEnum;
  purchaseDate: Date;
  destination: string;
  description?: string;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;

  constructor(data: ExpenseType) {
    this.amount = data.amount;
    this.expenseType = data.expenseType;
    this.purchaseDate = data.purchaseDate;
    this.destination = data.destination;
    this.description = data.description;
    this.accountId = data.accountId;
    this.categoryId = data.categoryId;
    this.justForRecord = data.justForRecord;
  }
}
