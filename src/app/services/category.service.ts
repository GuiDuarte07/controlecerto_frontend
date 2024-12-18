import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { map } from 'rxjs';
import { UpdateCategoryRequest } from '../models/UpdateCategoryRequest';
import { BillTypeEnum } from '../enums/BillTypeEnum';
import { serverConnectionString } from '../config/server';
import { InfoParentCategoryResponse } from '../models/InfoParentCategoryResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private hostAddress = `${serverConnectionString}/Category`;
  constructor(private http: HttpClient) {}

  GetCategories(type?: BillTypeEnum) {
    let suffix = 'GetAllCategories';
    return this.http
      .get<InfoParentCategoryResponse[]>(
        `${this.hostAddress}/${suffix}${
          typeof type !== 'undefined' ? '/' + type : ''
        }`
      )
      .pipe(
        map((data) =>
          data.map(
            (item) =>
              new InfoParentCategoryResponse(
                item.id,
                item.name,
                item.icon,
                item.billType,
                item.color,
                item.subCategories.map(
                  (item_sb) =>
                    new Category(
                      item_sb.id,
                      item_sb.name,
                      item_sb.icon,
                      item_sb.billType,
                      item_sb.color,
                      item_sb.parentId
                    )
                )
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
