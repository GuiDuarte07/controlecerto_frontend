import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvestmentService } from '../../../services/investment.service';
import { AccountSelectorComponent } from '../../../components/selection/account-selector/account-selector.component';
import { InfoInvestmentResponse } from '../../../models/investments/InfoInvestmentResponse';
import { DepositInvestmentRequest } from '../../../models/investments/DepositInvestmentRequest';
import { AdjustInvestmentRequest } from '../../../models/investments/AdjustInvestmentRequest';
import { InvestmentHistoryResponse } from '../../../models/investments/InvestmentHistoryResponse';

@Component({
  selector: 'app-investment-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    ChartModule,
    ConfirmDialogModule,
    CurrencyMaskDirective,
    AccountSelectorComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './investment-details.component.html',
  styleUrls: ['./investment-details.component.scss'],
})
export class InvestmentDetailsComponent implements OnInit, OnDestroy {
  investment?: InfoInvestmentResponse;

  depositVisible = false;
  withdrawVisible = false;
  adjustVisible = false;

  activeTab: 'history' | 'charts' = 'history';
  lineChartData: any;
  pieChartData: any;
  chartOptions: any;

  depositForm!: FormGroup;
  withdrawForm!: FormGroup;
  adjustForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private investmentService: InvestmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.initializeChartOptions();
    this.loadInvestment();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    const today = new Date();

    this.depositForm = new FormGroup({
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      accountId: new FormControl(null),
      occurredAt: new FormControl(today),
      note: new FormControl(''),
    });

    this.withdrawForm = new FormGroup({
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      accountId: new FormControl(null),
      occurredAt: new FormControl(today),
      note: new FormControl(''),
    });

    this.adjustForm = new FormGroup({
      newTotalValue: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      occurredAt: new FormControl(today),
      note: new FormControl(''),
    });
  }

  private loadInvestment(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.investmentService
          .getInvestmentById(parseInt(id))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (investment) => {
              this.investment = investment;
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar investimento.',
              });
            },
          });
      }
    });
  }

  openDeposit(): void {
    this.depositForm.reset({
      occurredAt: new Date(),
    });
    this.depositVisible = true;
  }

  openWithdraw(): void {
    this.withdrawForm.reset({
      occurredAt: new Date(),
    });
    this.withdrawVisible = true;
  }

  openAdjust(): void {
    this.adjustForm.reset({
      newTotalValue: this.investment?.currentValue ?? 0,
      occurredAt: new Date(),
    });
    this.adjustVisible = true;
  }

  confirmDeposit(): void {
    if (!this.investment || this.depositForm.invalid) return;

    const payload: DepositInvestmentRequest = {
      investmentId: this.investment.id,
      amount: this.depositForm.value.amount,
      accountId: this.depositForm.value.accountId,
      occurredAt: this.depositForm.value.occurredAt?.toISOString(),
      note: this.depositForm.value.note,
    };

    this.investmentService
      .deposit(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.investment = updated;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Depósito realizado com sucesso.',
          });
          this.depositVisible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao realizar depósito.',
          });
        },
      });
  }

  confirmWithdraw(): void {
    if (!this.investment || this.withdrawForm.invalid) return;

    const payload: DepositInvestmentRequest = {
      investmentId: this.investment.id,
      amount: this.withdrawForm.value.amount,
      accountId: this.withdrawForm.value.accountId,
      occurredAt: this.withdrawForm.value.occurredAt?.toISOString(),
      note: this.withdrawForm.value.note,
    };

    this.investmentService
      .withdraw(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.investment = updated;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Saque realizado com sucesso.',
          });
          this.withdrawVisible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao realizar saque.',
          });
        },
      });
  }

  confirmAdjust(): void {
    if (!this.investment || this.adjustForm.invalid) return;

    const newValue = this.adjustForm.value.newTotalValue;
    const currentValue = this.investment.currentValue;

    // Verificar se o novo valor é menor que o atual
    if (newValue < currentValue) {
      const difference = currentValue - newValue;
      this.confirmationService.confirm({
        header: 'Atenção: Redução de Valor',
        message: `O valor inserido (${newValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) é menor que o valor atual (${currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Isso resultará em uma redução de ${difference.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.<br><br><strong>Se você deseja remover dinheiro do investimento, considere usar a opção "Sacar" ao invés de ajustar.</strong><br><br>Deseja realmente continuar com o ajuste?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, ajustar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-warning',
        accept: () => {
          this.processAdjust();
        },
      });
    } else {
      this.processAdjust();
    }
  }

  private processAdjust(): void {
    if (!this.investment) return;

    const payload: AdjustInvestmentRequest = {
      investmentId: this.investment.id,
      newTotalValue: this.adjustForm.value.newTotalValue,
      occurredAt: this.adjustForm.value.occurredAt?.toISOString(),
      note: this.adjustForm.value.note,
    };

    this.investmentService
      .adjustValue(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.investment = updated;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Valor ajustado com sucesso.',
          });
          this.adjustVisible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao ajustar valor.',
          });
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/investments']);
  }

  getOperationType(type: string): string {
    const types: { [key: string]: string } = {
      DEPOSIT: 'Depósito',
      WITHDRAW: 'Saque',
      ADJUST: 'Ajuste',
    };
    return types[type] || type;
  }

  getOperationSign(type: string): string {
    if (this.isDepositOrAdjust(type)) return '+';
    if (this.isWithdraw(type)) return '-';
    return '';
  }

  isDepositOrAdjust(type: string): boolean {
    return type === 'DEPOSIT' || type === 'ADJUST';
  }

  isWithdraw(type: string): boolean {
    return type === 'WITHDRAW';
  }

  switchTab(tab: 'history' | 'charts'): void {
    this.activeTab = tab;
    if (tab === 'charts' && this.investment) {
      this.prepareChartData();
    }
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || context.parsed;
              return (
                label +
                ': R$ ' +
                value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
              );
            },
          },
        },
      },
    };
  }

  private prepareChartData(): void {
    if (!this.investment?.histories || this.investment.histories.length === 0) {
      return;
    }

    // Ordenar histórico por data
    const sortedHistories = [...this.investment.histories].sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    );

    // Preparar dados para gráfico de linha (evolução do valor)
    const labels = sortedHistories.map((h) =>
      new Date(h.occurredAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    );
    const values = sortedHistories.map((h) => h.totalValue);

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Valor Total',
          data: values,
          fill: true,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    };

    // Preparar dados para gráfico de pizza (distribuição por tipo)
    const totals = {
      DEPOSIT: 0,
      WITHDRAW: 0,
      ADJUST: 0,
    };

    console.log(sortedHistories);

    sortedHistories.forEach((h) => {
      if (h.type === 'INVEST') {
        totals.DEPOSIT += h.changeAmount;
      } else if (h.type === 'WITHDRAW') {
        totals.WITHDRAW += Math.abs(h.changeAmount);
      } else if (h.type === 'ADJUSTMENT') {
        totals.ADJUST += Math.abs(h.changeAmount);
      }
    });

    this.pieChartData = {
      labels: ['Depósitos', 'Saques', 'Ajustes'],
      datasets: [
        {
          data: [totals.DEPOSIT, totals.WITHDRAW, totals.ADJUST],
          backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
          hoverBackgroundColor: ['#059669', '#d97706', '#2563eb'],
        },
      ],
    };
  }
}
