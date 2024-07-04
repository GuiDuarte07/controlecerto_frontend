import { TransactionTypeEnum } from '../enums/TransactionTypeEnum';

export class CreateTransactionRequest {
  amount: number;
  type: TransactionTypeEnum;
  purchaseDate: Date;
  destination: string;
  description?: string;
  observations?: string;
  accountId: number;
  categoryId: number;
  justForRecord: boolean;

  constructor({
    amount,
    type,
    purchaseDate,
    description,
    destination,
    accountId,
    categoryId,
    justForRecord,
    observations,
  }: {
    amount: number;
    type: TransactionTypeEnum;
    purchaseDate: Date;
    destination: string;
    description: string | undefined;
    observations: string | undefined;
    accountId: number;
    categoryId: number;
    justForRecord: boolean;
  }) {
    this.amount = amount;
    this.type = type;
    this.purchaseDate = purchaseDate;
    this.destination = destination;
    this.description = description;
    this.observations = observations;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.justForRecord = justForRecord;
  }
}
