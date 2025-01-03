export class UpdateCategoryRequest {
  id: number;
  name?: string;
  icon?: string;
  color?: string;
  parentId?: number;

  constructor({
    id,
    name,
    icon,
    color,
    parentId,
  }: {
    id: number;
    name?: string;
    icon?: string;
    color?: string;
    parentId?: number | null;
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.parentId = parentId ?? undefined;
  }
}
