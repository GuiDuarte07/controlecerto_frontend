import { AccountInfo } from './AccountInfo';

export class CreditCardInfo {
  id: number;
  totalLimit: number;
  usedLimit: number;
  description: string;
  cardBrand: string;
  dueDay: Date;
  closeDay: Date;
  account: AccountInfo;

  constructor(
    id: number,
    totalLimit: number,
    usedLimit: number,
    description: string,
    cardBrand: string,
    dueDay: Date,
    closeDay: Date,
    account: AccountInfo
  ) {
    this.id = id;
    this.totalLimit = totalLimit;
    this.usedLimit = usedLimit;
    this.description = description;
    this.cardBrand = cardBrand;
    this.dueDay = dueDay;
    this.closeDay = closeDay;
    this.account = account;
  }
}
