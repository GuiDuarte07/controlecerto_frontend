export class InfoCreditExpense {
  id: number;
  amount: number;
  description: string;
  purchaseDate: Date;
  installmentNumber: number;
  destination: string;
  creditPurchaseId: number;

  constructor(
    id: number,
    amount: number,
    description: string,
    purchaseDate: Date,
    installmentNumber: number,
    destination: string,
    creditPurchaseId: number
  ) {
    this.id = id;
    this.amount = amount;
    this.description = description ?? '';
    this.purchaseDate = purchaseDate;
    this.installmentNumber = installmentNumber;
    this.destination = destination;
    this.creditPurchaseId = creditPurchaseId;
  }
}
