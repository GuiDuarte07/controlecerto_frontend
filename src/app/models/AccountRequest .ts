import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class Account {
  id?: number;
  balance: number;
  description: string;
  bank: string;
  color: string;

  constructor(data: {
    balance: number;
    description: string;
    bank: string;
    color: string;
    id?: number;
  }) {
    this.id = data.id;
    this.balance = data.balance;
    this.description = data.description;
    this.bank = data.bank;
    this.color = data.color;
  }
}
