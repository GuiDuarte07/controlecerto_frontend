import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { map } from 'rxjs';
import { UpdateCategoryRequest } from '../models/UpdateCategoryRequest';
import { BillTypeEnum } from '../enums/BillTypeEnum';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private hostAddress = 'http://localhost:5037/api/Category';
  constructor(private http: HttpClient) {}

  GetCategories(type?: BillTypeEnum) {
    let suffix = 'GetAllCategories';
    return this.http
      .get<Category[]>(`${this.hostAddress}/${suffix}${type ? '/' + type : ''}`)
      .pipe(
        map((data) =>
          data.map(
            (item) =>
              new Category(
                item.id,
                item.name,
                item.icon,
                item.billType,
                item.color
              )
          )
        )
      );
  }

  createCategory(category: Category) {
    const suffix = 'CreateCategory';
    return this.http.post<Category>(`${this.hostAddress}/${suffix}`, category);
  }

  updateCategory(category: UpdateCategoryRequest) {
    const suffix = 'UpdateCategory';
    return this.http.patch<Category>(`${this.hostAddress}/${suffix}`, category);
  }

  deleteCategory(categoryId: number) {
    const suffix = 'DeleteCategory';
    return this.http.delete<void>(
      `${this.hostAddress}/${suffix}/${categoryId}`
    );
  }
}
