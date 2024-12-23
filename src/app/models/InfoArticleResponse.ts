import { NotificationTypeEnum } from '../enums/NotificationTypeEnum';
import { InfoUserResponse } from './InfoUserResponse';

export class InfoArticleResponse {
  id: number;
  title: string;
  mdFileName: string;
  createdAt: Date;
  updatedAt: Date;
  user: InfoUserResponse;

  constructor(
    id: number,
    title: string,
    mdFileName: string,
    createdAt: Date,
    updatedAt: Date,
    user: InfoUserResponse
  ) {
    this.id = id;
    this.title = title;
    this.mdFileName = mdFileName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.user = user;
  }
}
