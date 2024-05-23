import { CreateTansactionsTypesComponent } from './../create-transactions-types/create-transactions-types.component';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CreateTansactionsTypesComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}
