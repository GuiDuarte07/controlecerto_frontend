import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CreateExpenseModalComponent } from '../create-expense-modal/create-expense-modal.component';
import { CreateIncomeModalComponent } from '../create-income-modal/create-income-modal.component';

@Component({
  selector: 'app-create-tansactions-types',
  standalone: true,
  imports: [CreateExpenseModalComponent],
  templateUrl: './create-transactions-types.component.html',
  styleUrl: './create-transactions-types.component.scss',
})
export class CreateTansactionsTypesComponent {}
