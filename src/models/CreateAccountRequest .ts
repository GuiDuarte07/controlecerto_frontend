import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class CreateAccountRequest {
  balance: number;
  description: string;
  bank: string;
  accountType: AccountTypeEnum;
  color: string;

  constructor(data: {
    balance: number;
    description: string;
    bank: string;
    accountType: AccountTypeEnum;
    color: string;
  }) {
    this.balance = data.balance;
    this.description = data.description;
    this.bank = data.bank;
    this.accountType = data.accountType;
    this.color = data.color;
  }
}
