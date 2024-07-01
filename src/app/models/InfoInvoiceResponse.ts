export class InfoInvoiceResponse {
  id: number;
  totalAmount: number;
  totalPaid: number;
  isPaid: boolean;
  closingDate: Date;
  dueDate: Date;

  constructor(
    id: number,
    totalAmount: number,
    totalPaid: number,
    isPaid: boolean,
    closingDate: Date,
    dueDate: Date
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.totalPaid = totalPaid;
    this.isPaid = isPaid;
    this.closingDate = closingDate;
    this.dueDate = dueDate;
  }
}
