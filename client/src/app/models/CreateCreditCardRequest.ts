export class CreateCreditCardRequest {
  totalLimit: number;
  usedLimit: number;
  description: string;
  dueDay: number;
  closeDay: number;
  accountId: number;
  skipWeekend: boolean;

  constructor({
    totalLimit,
    usedLimit,
    description,
    dueDay,
    closeDay,
    accountId,
    skipWeekend,
  }: {
    totalLimit: number;
    usedLimit: number;
    description: string;
    dueDay: number;
    closeDay: number;
    accountId: number;
    skipWeekend: boolean;
  }) {
    this.totalLimit = totalLimit;
    this.usedLimit = usedLimit;
    this.description = description;
    this.dueDay = dueDay;
    this.closeDay = closeDay;
    this.accountId = accountId;
    this.skipWeekend = skipWeekend;
  }
}
