export class CreateCreditCardRequest {
  totalLimit: number;
  usedLimit: number;
  description: string;
  cardBrand: string;
  dueDay: number;
  closeDay: number;
  accountId: number;

  constructor({
    totalLimit,
    usedLimit,
    description,
    cardBrand,
    dueDay,
    closeDay,
    accountId,
  }: {
    totalLimit: number;
    usedLimit: number;
    description: string;
    cardBrand: string;
    dueDay: number;
    closeDay: number;
    accountId: number;
  }) {
    this.totalLimit = totalLimit;
    this.usedLimit = usedLimit;
    this.description = description;
    this.cardBrand = cardBrand;
    this.dueDay = dueDay;
    this.closeDay = closeDay;
    this.accountId = accountId;
  }
}
