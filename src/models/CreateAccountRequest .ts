import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class CreateAccountRequest {
  balance: number;
  description?: string;
  bank: string;
  accountType: AccountTypeEnum;
  color?: string;

  constructor(
    balance: number,
    description: string | undefined,
    bank: string,
    accountType: AccountTypeEnum,
    color: string | undefined
  ) {
    this.balance = balance;
    this.description = description;
    this.bank = bank;
    this.accountType = accountType;
    this.color = color;
  }
}
