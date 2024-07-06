import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule, MatBadgeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout() {
    this.authService.logout();
  }
}
