import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { InvestmentService } from '../../services/investment.service';
import { InfoInvestmentResponse } from '../../models/investments/InfoInvestmentResponse';
import { InvestmentDialogComponent } from '../../components/dialogs/investment-dialog/investment-dialog.component';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, InvestmentDialogComponent],
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
})
export class InvestmentsComponent implements OnInit {
  investments: InfoInvestmentResponse[] = [];

  @ViewChild('dialog') dialog!: InvestmentDialogComponent;

  constructor(
    private investmentService: InvestmentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.investmentService
      .getInvestments()
      .subscribe((res) => (this.investments = res));
  }

  openNew() {
    this.dialog.openDialog();
    this.dialog.saved.subscribe(() => this.load());
  }

  openDetail(inv: InfoInvestmentResponse) {
    this.router.navigate(['/investments', inv.id]);
  }
}
