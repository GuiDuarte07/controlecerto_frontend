import { api } from "@/lib/api/client";
import type { InfoNotificationResponse } from "@/types";

const BASE = "/Notification";

export const notificationService = {
  getRecentNotifications: () =>
    api.get<InfoNotificationResponse[]>(`${BASE}/GetRecentNotifications`),

  getAllNotifications: () =>
    api.get<InfoNotificationResponse[]>(`${BASE}/GetAllNotifications`),

  markAsRead: (notificationIds: number[]) =>
    api.patch<void>(`${BASE}/MarkAsRead`, { notificationIds }),

  deleteNotification: (id: number) =>
    api.delete<void>(`${BASE}/${id}`),
};
