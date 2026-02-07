import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvestmentService } from '../../../../app/services/investment.service';
import { CreateInvestmentRequest } from '../../../../app/models/investments/CreateInvestmentRequest';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';

@Component({
  selector: 'app-investment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CurrencyMaskDirective,
  ],
  providers: [MessageService],
  templateUrl: './investment-dialog.component.html',
  styleUrls: ['./investment-dialog.component.scss'],
})
export class InvestmentDialogComponent implements OnInit {
  @Output() saved = new EventEmitter<boolean>();

  visible = false;
  form!: FormGroup;

  constructor(
    private investmentService: InvestmentService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      initialAmount: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  openDialog() {
    this.form.reset({ initialAmount: 0 });
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  save() {
    if (this.form.invalid) return;

    const payload: CreateInvestmentRequest = {
      name: this.form.value.name,
      initialAmount: this.form.value.initialAmount || 0,
      description: this.form.value.description,
    };

    this.investmentService.createInvestment(payload).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Criado',
          detail: 'Investimento criado com sucesso.',
        });
        this.saved.emit(true);
        this.closeDialog();
      },
      () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar investimento.',
        }),
    );
  }
}
