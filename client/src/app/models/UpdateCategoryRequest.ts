export class UpdateCategoryRequest {
  id: number;
  name?: string;
  icon?: string;
  color?: string;

  constructor({
    id,
    name,
    icon,
    color,
  }: {
    id: number;
    name?: string;
    icon?: string;
    color?: string;
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
  }
}
