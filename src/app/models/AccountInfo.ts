import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class AccountInfo {
  id: number;
  balance: number;
  description: string;
  bank: string;
  accountType: AccountTypeEnum;
  color: string;

  constructor(
    id: number,
    balance: number,
    description: string,
    bank: string,
    accountType: AccountTypeEnum,
    color: string
  ) {
    this.id = id;
    this.balance = balance;
    this.description = description;
    this.bank = bank;
    this.accountType = accountType;
    this.color = color;
  }
}
