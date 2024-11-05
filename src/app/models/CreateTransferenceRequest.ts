export class CreateTransferenceRequest {
  amount: number;
  description: string | null;
  purchaseDate: Date;
  accountOriginId: number | null;
  accountDestinyId: number | null;

  constructor(
    amount: number,
    description: string | null,
    purchaseDate: Date,
    accountOriginId: number | null,
    accountDestinyId: number | null
  ) {
    this.amount = amount;
    this.description = description;
    this.purchaseDate = purchaseDate;
    this.accountOriginId = accountOriginId;
    this.accountDestinyId = accountDestinyId;
  }
}

export class InfoTransferenceResponse extends CreateTransferenceRequest {
  id: number;

  constructor(
    id: number,
    amount: number,
    description: string | null,
    purchaseDate: Date,
    accountOriginId: number | null,
    accountDestinyId: number | null
  ) {
    super(amount, description, purchaseDate, accountOriginId, accountDestinyId);
    this.id = id;
  }
}
