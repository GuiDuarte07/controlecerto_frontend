import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountService } from '../../services/account.service';
import { BalanceStatement } from '../../models/BalanceStatement';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  balance: BalanceStatement = {
    balance: 0,
    expenses: 0,
    incomes: 0,
    invoices: 0,
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getBalance().subscribe((b) => {
      this.balance = b;
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }
}
