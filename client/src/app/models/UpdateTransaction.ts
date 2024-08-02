export class UpdateTransactionRequest {
  id: number;
  amount?: number;
  purchaseDate?: Date;
  destination?: string;
  description?: string;
  observations?: string;
  categoryId?: number;

  constructor({
    id,
    amount,
    categoryId,
    description,
    destination,
    observations,
    purchaseDate,
  }: {
    id: number;
    amount?: number;
    purchaseDate?: Date;
    destination?: string;
    description?: string;
    observations?: string;
    categoryId?: number;
  }) {
    this.id = id;
    this.amount = amount;
    this.purchaseDate = purchaseDate;
    this.destination = destination;
    this.description = description;
    this.observations = observations;
    this.categoryId = categoryId;
  }
}
