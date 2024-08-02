import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrations',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss',
})
export class RegistrationsComponent {
  constructor(private router: Router) {}
  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}
