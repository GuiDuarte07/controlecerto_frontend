import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private hostAddress = 'http://localhost:5037/api/Category';
  constructor(private http: HttpClient) {}

  GetCategories() {
    let suffix = 'GetAllCategories';
    return this.http
      .get<Category[]>(`${this.hostAddress}/${suffix}`)
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
}
