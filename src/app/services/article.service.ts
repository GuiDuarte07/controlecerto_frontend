import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverConnectionString } from '../config/server';
import { InfoNotificationResponse } from '../models/InfoNotificationResponse ';
import { InfoArticleResponse } from '../models/InfoArticleResponse';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private hostAddress = `${serverConnectionString}/Article`;

  constructor(private http: HttpClient) {}

  getArticleByTitle(title: string) {
    const rote = 'GetArticleByTitle';
    //parametro opicional -> IsRead
    return this.http.get<InfoArticleResponse>(
      `${this.hostAddress}/${rote}/${title}`
    );
  }
}
