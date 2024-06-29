export class CreateCreditPurchaseRequest {
  totalAmount: number;
  totalInstallment: number;
  installmentsPaid: number;
  purchaseDate: Date | null;
  destination: string;
  description?: string;
  creditCardId: number;
  categoryId: number;

  constructor(
    totalAmount: number,
    totalInstallment: number,
    installmentsPaid: number = 0,
    purchaseDate: Date,
    destination: string,
    description: string | undefined,
    creditCardId: number,
    categoryId: number
  ) {
    this.totalAmount = totalAmount;
    this.totalInstallment = totalInstallment;
    this.installmentsPaid = installmentsPaid;
    this.purchaseDate = purchaseDate;
    this.destination = destination;
    this.description = description;
    this.creditCardId = creditCardId;
    this.categoryId = categoryId;
  }
}
