import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationService } from '../../services/notification.service';
import { InfoNotificationResponse } from '../../models/InfoNotificationResponse ';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatBadgeModule,
    MenuModule,
    OverlayPanelModule,
    BadgeModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @ViewChild('notificationPanel') notificationPanel!: OverlayPanel;

  notifications: InfoNotificationResponse[] = [];

  profileMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => this.router.navigateByUrl('/profile'),
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationService
      .getRecentNotifications()
      .subscribe((ns) => (this.notifications = ns));
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  newNotificationsCount() {
    return this.notifications.reduce(
      (count, n) => count + (n.isRead ? 0 : 1),
      0
    );
  }

  handleNotificationBadge(event: Event) {
    this.notificationPanel.toggle(event);

    if (this.notifications.some((n) => n.isRead === false)) {
      this.notificationService
        .markAsRead(
          this.notifications.filter((n) => n.isRead === false).map((n) => n.id)
        )
        .subscribe();
    }
  }

  deleteNotification(id: number) {
    this.notificationService.delete(id).subscribe((_) => {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    });
  }

  notificationActionPath(action: string | undefined) {
    if (action) {
      this.router.navigateByUrl(action);
    }
  }

  logout() {
    this.authService.logout();
  }
}
