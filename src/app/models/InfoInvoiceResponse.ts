import { CreditCardInfo } from './CreditCardInfo';
import { InfoInvoicePaymentResponse } from './InfoInvoicePaymentResponse ';
import { InfoTransactionResponse } from './InfoTransactionResponse';

export class InfoInvoiceResponse {
  id: number;
  totalAmount: number;
  totalPaid: number;
  isPaid: boolean;
  closingDate: Date;
  dueDate: Date;
  creditCard: CreditCardInfo;
  transactions?: InfoTransactionResponse[];
  invoicePayments?: InfoInvoicePaymentResponse[];

  constructor(
    id: number,
    totalAmount: number,
    totalPaid: number,
    isPaid: boolean,
    closingDate: Date,
    dueDate: Date,
    creditCard: CreditCardInfo,
    transactions?: InfoTransactionResponse[],
    invoicePayments?: InfoInvoicePaymentResponse[]
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.totalPaid = totalPaid;
    this.isPaid = isPaid;
    this.closingDate = closingDate;
    this.dueDate = dueDate;
    this.creditCard = creditCard;
    this.transactions = transactions;
    this.invoicePayments = invoicePayments;
  }
}
