import { NotificationTypeEnum } from '../enums/NotificationTypeEnum';

export class InfoNotificationResponse {
  id: number;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  actionPath?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;

  constructor(
    id: number,
    title: string,
    message: string,
    type: NotificationTypeEnum,
    isRead: boolean,
    createdAt: Date,
    expiresAt: Date,
    actionPath?: string
  ) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.actionPath = actionPath;
  }
}
