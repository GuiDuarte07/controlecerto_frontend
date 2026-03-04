"use client";

import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/features/notifications/services/notifications.service";
import { formatDate } from "@/lib/utils/format";

const pageTitles: Record<string, string> = {
  "/home": "Visão Geral",
  "/transactions": "Lançamentos",
  "/accounts": "Contas",
  "/credit-cards": "Cartões de Crédito",
  "/categories": "Categorias",
  "/investments": "Investimentos",
  "/profile": "Perfil",
};

export function DashboardHeader({ pathname }: { pathname: string }) {
  const basePath = "/" + pathname.split("/").filter(Boolean)[0];
  const title = pageTitles[basePath] || "Controle Certo";

  const { data: notifications } = useQuery({
    queryKey: ["notifications-recent"],
    queryFn: () => notificationService.getRecentNotifications(),
    refetchInterval: 60000,
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-4 min-w-4 justify-center px-1 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notificações</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b p-3">
              <h4 className="text-sm font-semibold">Notificações</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <ScrollArea className="h-64">
              {notifications && notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex flex-col gap-1 border-b p-3 text-sm last:border-0 ${
                        !n.isRead ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{n.title}</span>
                        {!n.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {n.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
