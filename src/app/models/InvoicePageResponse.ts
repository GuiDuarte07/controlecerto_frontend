import { InfoInvoiceResponse } from './InfoInvoiceResponse';

export class InvoicePageResponse {
  invoice: InfoInvoiceResponse;
  nextInvoiceId?: number;
  prevInvoiceId?: number;

  constructor(
    invoice: InfoInvoiceResponse,
    nextInvoiceId?: number,
    prevInvoiceId?: number
  ) {
    this.invoice = invoice;
    this.nextInvoiceId = nextInvoiceId;
    this.prevInvoiceId = prevInvoiceId;
  }
}
