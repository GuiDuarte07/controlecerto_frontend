import { IncomeTypeEnum } from '../enums/IncomeTypeEnum';

interface ICreateIncomeType {
  amount: number;
  incomeType: IncomeTypeEnum;
  purchaseDate: Date;
  origin: string;
  description: string | undefined;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;
}

export class CreateIncome {
  amount: number;
  incomeType: IncomeTypeEnum;
  purchaseDate: Date;
  origin: string;
  description?: string;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;

  constructor(data: ICreateIncomeType) {
    this.amount = data.amount;
    this.incomeType = data.incomeType;
    this.purchaseDate = data.purchaseDate;
    this.origin = data.origin;
    this.description = data.description;
    this.accountId = data.accountId;
    this.categoryId = data.categoryId;
    this.justForRecord = data.justForRecord;
  }
}
