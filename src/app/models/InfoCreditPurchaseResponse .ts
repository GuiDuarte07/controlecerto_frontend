export class InfoCreditPurchaseResponse {
  id: number;
  totalAmount: number;
  totalInstallment: number;
  installmentsPaid: number;
  purchaseDate?: Date;
  paid: boolean;
  destination: string;
  description?: string;
  creditCardId: number;

  constructor(
    id: number,
    totalAmount: number,
    totalInstallment: number,
    installmentsPaid: number,
    purchaseDate: Date | undefined,
    paid: boolean,
    destination: string,
    description: string | undefined,
    creditCardId: number
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.totalInstallment = totalInstallment;
    this.installmentsPaid = installmentsPaid;
    this.purchaseDate = purchaseDate;
    this.paid = paid;
    this.destination = destination;
    this.description = description;
    this.creditCardId = creditCardId;
  }
}
