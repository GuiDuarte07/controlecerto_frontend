import { Injectable } from '@angular/core';
import { serverConnectionString } from '../config/server';
import { HttpClient } from '@angular/common/http';
import { InfoNotificationResponse } from '../models/InfoNotificationResponse ';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hostAddress = `${serverConnectionString}/Notification`;

  constructor(private http: HttpClient) {}

  getRecentNotifications() {
    const rote = 'GetRecentNotifications';
    //parametro opicional -> IsRead
    return this.http.get<InfoNotificationResponse[]>(
      `${this.hostAddress}/${rote}`
    );
  }

  getAllNotifications() {
    const rote = 'GetAllNotifications';
    return this.http.get<InfoNotificationResponse[]>(
      `${this.hostAddress}/${rote}`
    );
  }

  markAsRead(notificationIds: number[]) {
    const rote = 'MarkAsRead';
    return this.http.patch<void>(`${this.hostAddress}/${rote}`, {
      notificationIds,
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.hostAddress}/${id}`);
  }
}
