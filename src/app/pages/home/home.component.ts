import { Component } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent, AccountModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
