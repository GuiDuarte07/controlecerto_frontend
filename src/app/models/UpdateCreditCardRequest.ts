export class UpdateCreditCardRequest {
  id: number;
  totalLimit?: number;
  description?: string;

  constructor({
    id,
    totalLimit,
    description,
  }: {
    id: number;
    totalLimit?: number;
    description?: string;
  }) {
    this.id = id;
    this.totalLimit = totalLimit;
    this.description = description;
  }
}
