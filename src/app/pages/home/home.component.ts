import { Component } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { AccountModalComponent } from '../../components/account-modal/account-modal.component';
import { CreateExpenseModalComponent } from '../../components/create-expense-modal/create-expense-modal.component';
import { CreateTansactionsTypesComponent } from '../../components/create-tansactions-types/create-tansactions-types.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ModalComponent,
    AccountModalComponent,
    CreateExpenseModalComponent,
    CreateTansactionsTypesComponent,
    SidebarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
