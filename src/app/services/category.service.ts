import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { map } from 'rxjs';
import { UpdateCategoryRequest } from '../models/UpdateCategoryRequest';
import { BillTypeEnum } from '../enums/BillTypeEnum';
import { serverConnectionString } from '../config/server';
import { InfoParentCategoryResponse } from '../models/InfoParentCategoryResponse';
import { InfoLimitResponse } from '../models/InfoLimitResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private hostAddress = `${serverConnectionString}/Category`;
  constructor(private http: HttpClient) {}

  GetCategories(type?: BillTypeEnum) {
    let route = 'GetAllCategories';
    return this.http
      .get<InfoParentCategoryResponse[]>(
        `${this.hostAddress}/${route}${
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
                item.limit,
                item.subCategories.map(
                  (item_sb) =>
                    new Category(
                      item_sb.id,
                      item_sb.name,
                      item_sb.icon,
                      item_sb.billType,
                      item_sb.color,
                      item_sb.limit,
                      item_sb.parentId
                    )
                )
              )
          )
        )
      );
  }

  createCategory(category: Category) {
    const route = 'CreateCategory';
    return this.http.post<Category>(`${this.hostAddress}/${route}`, category);
  }

  updateCategory(category: UpdateCategoryRequest) {
    const route = 'UpdateCategory';
    return this.http.patch<Category>(`${this.hostAddress}/${route}`, category);
  }

  deleteCategory(categoryId: number) {
    const route = 'DeleteCategory';
    return this.http.delete<void>(`${this.hostAddress}/${route}/${categoryId}`);
  }

  getLimitInfo(categoryId: number) {
    const route = 'GetLimitInfo';
    return this.http.get<InfoLimitResponse>(
      `${this.hostAddress}/${route}/${categoryId}`
    );
  }

  updateCategoryLimit(categoryId: number, limit: number) {
    const route = 'UpdateCategoryLimit';
    return this.http.patch<Category>(`${this.hostAddress}/${route}`, {
      categoryId: categoryId,
      amount: limit,
    });
  }
}
