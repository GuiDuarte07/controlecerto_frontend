import { AccountInfo } from './AccountInfo';

export class CreditCardInfo {
  id: number;
  totalLimit: number;
  usedLimit: number;
  description: string;
  dueDay: number;
  closeDay: number;
  account: AccountInfo;

  constructor(
    id: number,
    totalLimit: number,
    usedLimit: number,
    description: string,
    dueDay: number,
    closeDay: number,
    account: AccountInfo
  ) {
    this.id = id;
    this.totalLimit = totalLimit;
    this.usedLimit = usedLimit;
    this.description = description;
    this.dueDay = dueDay;
    this.closeDay = closeDay;
    this.account = account;
  }
}
