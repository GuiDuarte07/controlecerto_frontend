import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  s3Url = 'https://controlecerto-publics.s3.us-east-1.amazonaws.com/';

  constructor(private http: HttpClient) {}

  getMarkdown(fileName: string): Observable<string> {
    return this.http.get(this.s3Url + fileName, { responseType: 'text' });
  }
}
