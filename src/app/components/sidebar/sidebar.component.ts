import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionDialogComponent } from '../dialogs/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionTypeEnum } from '../../enums/TransactionTypeEnum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}
