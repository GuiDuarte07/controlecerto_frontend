interface UpdateCreditPurchaseRequestParams {
  id: number;
  totalAmount?: number;
  totalInstallment?: number;
  purchaseDate?: Date;
  destination?: string;
  description?: string;
  creditCardId?: number;
  categoryId: number;
}

export class UpdateCreditPurchaseRequest {
  id: number;
  totalAmount?: number;
  totalInstallment?: number;
  purchaseDate?: Date;
  destination?: string;
  description?: string;
  creditCardId?: number;
  categoryId: number;

  constructor(params: UpdateCreditPurchaseRequestParams) {
    this.id = params.id;
    this.totalAmount = params.totalAmount;
    this.totalInstallment = params.totalInstallment;
    this.purchaseDate = params.purchaseDate;
    this.destination = params.destination;
    this.description = params.description;
    this.creditCardId = params.creditCardId;
    this.categoryId = params.categoryId;
  }
}
