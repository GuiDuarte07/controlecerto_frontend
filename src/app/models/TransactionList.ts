import { InfoInvoiceResponse } from './InfoInvoiceResponse';
import { InfoTransactionResponse } from './InfoTransactionResponse';

export class TransactionList {
  transactions: InfoTransactionResponse[];
  invoices: InfoInvoiceResponse[];

  constructor({
    transactions,
    invoices,
  }: {
    transactions: InfoTransactionResponse[];
    invoices: InfoInvoiceResponse[];
  }) {
    this.transactions = transactions;
    this.invoices = invoices;
  }
}
