import { TransactionTypeEnum } from '../enums/TransactionTypeEnum';
import { AccountInfo } from './AccountInfo';
import { Category } from './Category';

export class InfoTransactionResponse {
  id: number;
  type: TransactionTypeEnum;
  amount: number;
  purchaseDate: Date;
  description: string;
  observations?: string;
  destination?: string;
  justForRecord: boolean;
  account: AccountInfo;
  category: Category;

  // Credit Card Transaction info:
  installmentNumber?: number;

  constructor({
    id,
    type,
    amount,
    purchaseDate,
    description,
    destination,
    justForRecord,
    account,
    category,
    installmentNumber,
    observations,
  }: {
    id: number;
    type: TransactionTypeEnum;
    amount: number;
    purchaseDate: Date;
    description: string;
    observations: string | undefined;
    destination: string | undefined;
    justForRecord: boolean;
    account: AccountInfo;
    category: Category;
    installmentNumber: number | undefined;
  }) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.purchaseDate = purchaseDate;
    this.description = description;
    this.observations = observations;
    this.destination = destination;
    this.justForRecord = justForRecord;
    this.account = account;
    this.category = category;
    this.installmentNumber = installmentNumber;
  }
}
