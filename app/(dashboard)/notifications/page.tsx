"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CreditCard,
  RefreshCw,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { notificationService } from "@/features/notifications/services/notifications.service";
import type { InfoNotificationResponse } from "@/types";
import { NotificationTypeEnum, notificationTypeLabels } from "@/types/enums";
import { formatDate } from "@/lib/utils/format";

function getNotificationIcon(type: NotificationTypeEnum) {
  switch (type) {
    case NotificationTypeEnum.SYSTEMUPDATE:
      return Info;
    case NotificationTypeEnum.SYSTEMALERT:
      return AlertCircle;
    case NotificationTypeEnum.INVOICEPENDING:
      return CreditCard;
    case NotificationTypeEnum.CONFIRMRECURRENCE:
      return RefreshCw;
    case NotificationTypeEnum.CATEGORYSPENDINGLIMIT:
      return Tag;
    default:
      return Bell;
  }
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getAllNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (ids: number[]) => notificationService.markAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Marcadas como lidas!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificacao removida!");
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notificacoes</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} nao lida${unreadCount > 1 ? "s" : ""}`
              : "Todas lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              const unreadIds =
                notifications
                  ?.filter((n) => !n.isRead)
                  .map((n) => n.id) ?? [];
              markReadMutation.mutate(unreadIds);
            }}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={() => markReadMutation.mutate([n.id])}
              onDelete={() => deleteMutation.mutate(n.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <BellOff className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhuma notificacao
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function NotificationItem({
  notification: n,
  onMarkRead,
  onDelete,
}: {
  notification: InfoNotificationResponse;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const Icon = getNotificationIcon(n.type);

  const content = (
    <Card
      className={`transition-colors ${
        !n.isRead ? "border-primary/30 bg-primary/5" : "hover:bg-muted/50"
      }`}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            !n.isRead ? "bg-primary/10" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              !n.isRead ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">{n.title}</h3>
            {!n.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {n.message}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {notificationTypeLabels[n.type]}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {formatDate(n.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!n.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkRead();
              }}
              title="Marcar como lida"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            title="Excluir"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (n.actionPath) {
    return <Link href={n.actionPath}>{content}</Link>;
  }

  return content;
}
