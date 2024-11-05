import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class UpdateAccountRequest {
  id: number;
  description: string | null;
  bank?: string;
  accountType?: AccountTypeEnum;
  color?: string;
  balance?: number;

  constructor({
    id,
    description,
    bank,
    accountType,
    color,
    balance,
  }: {
    id: number;
    description: string | null;
    bank?: string;
    accountType?: AccountTypeEnum;
    color?: string;
    balance?: number;
  }) {
    this.id = id;
    this.description = description;
    this.bank = bank;
    this.accountType = accountType;
    this.color = color;
    this.balance = balance;
  }
}
