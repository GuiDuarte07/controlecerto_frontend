import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss',
})
export class MasterComponent {}
