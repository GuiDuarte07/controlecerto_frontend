import { AccountTypeEnum } from '../enums/AccountTypeEnum ';

export class UpdateAccountRequest {
  id: number;
  description: string | null;
  bank?: string;
  accountType?: AccountTypeEnum;
  color?: string;

  constructor({
    id,
    description,
    bank,
    accountType,
    color,
  }: {
    id: number;
    description: string | null;
    bank?: string;
    accountType?: AccountTypeEnum;
    color?: string;
  }) {
    if (!id) {
      throw new Error("Campo 'Id' não informado.");
    }
    if (description && description.length > 100) {
      throw new Error("Campo 'Description' pode conter até 100 caracteres");
    }
    this.id = id;
    this.description = description;
    this.bank = bank;
    this.accountType = accountType;
    this.color = color;
  }
}
