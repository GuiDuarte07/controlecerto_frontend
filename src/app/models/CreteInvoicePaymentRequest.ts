export class CreateInvoicePaymentRequest {
  amountPaid: number;
  description: string;
  paymentDate: Date;
  invoiceId: number;
  accountId: number;
  justForRecord: boolean = false;

  constructor(
    amountPaid: number,
    description: string,
    paymentDate: Date,
    invoiceId: number,
    accountId: number,
    justForRecord: boolean = false
  ) {
    this.amountPaid = amountPaid;
    this.description = description;
    this.paymentDate = paymentDate;
    this.invoiceId = invoiceId;
    this.accountId = accountId;
    this.justForRecord = justForRecord;
  }
}
