import { BillTypeEnum } from '../enums/BillTypeEnum';

export class Category {
  id?: number;
  name: string;
  icon: string;
  billType: BillTypeEnum;
  color: string;
  parentId?: number;

  constructor(
    id: number | undefined,
    name: string,
    icon: string,
    billType: BillTypeEnum,
    color: string,
    parentId?: number
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.billType = billType;
    this.color = color;
    this.parentId = parentId;
  }
}
