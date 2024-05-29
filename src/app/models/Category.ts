import { BillTypeEnum } from '../enums/BillTypeEnum';

export class Category {
  id: number;
  name: string;
  icon: string;
  billType: BillTypeEnum;
  color: string;

  constructor(
    id: number,
    name: string,
    icon: string,
    billType: BillTypeEnum,
    color: string
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.billType = billType;
    this.color = color;
  }
}
