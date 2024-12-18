import { BillTypeEnum } from '../enums/BillTypeEnum';
import { Category } from './Category';

export class InfoParentCategoryResponse {
  id: number;
  name: string;
  icon: string;
  billType: BillTypeEnum;
  color: string;
  subCategories: Category[];

  constructor(
    id: number,
    name: string,
    icon: string,
    billType: BillTypeEnum,
    color: string,
    subCategories: Category[]
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.billType = billType;
    this.color = color;
    this.subCategories = subCategories;
  }
}
