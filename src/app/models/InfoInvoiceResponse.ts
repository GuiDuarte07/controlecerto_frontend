import { CreditCardInfo } from './CreditCardInfo';
import { InfoTransactionResponse } from './InfoTransactionResponse';

export class InfoInvoiceResponse {
  id: number;
  totalAmount: number;
  totalPaid: number;
  isPaid: boolean;
  closingDate: Date;
  dueDate: Date;
  transactions?: InfoTransactionResponse[];
  creditCard: CreditCardInfo;

  constructor(
    id: number,
    totalAmount: number,
    totalPaid: number,
    isPaid: boolean,
    closingDate: Date,
    dueDate: Date,
    creditCard: CreditCardInfo,
    transactions?: InfoTransactionResponse[]
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.totalPaid = totalPaid;
    this.isPaid = isPaid;
    this.closingDate = closingDate;
    this.dueDate = dueDate;
    this.creditCard = creditCard;
    this.transactions = transactions;
  }
}
