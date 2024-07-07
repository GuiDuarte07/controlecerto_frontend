import { Account } from './AccountRequest ';

export class InfoInvoicePaymentResponse {
  id: number;
  amountPaid: number;
  description: string;
  paymentDate: Date;
  account: Account;
  justForRecord: boolean;

  constructor(
    id: number,
    amountPaid: number,
    description: string,
    paymentDate: Date,
    account: Account,
    justForRecord: boolean
  ) {
    this.id = id;
    this.amountPaid = amountPaid;
    this.description = description;
    this.paymentDate = paymentDate;
    this.account = account;
    this.justForRecord = justForRecord;
  }
}
