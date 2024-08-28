import { CreditCardService } from './../../../services/credit-card.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { InfoCreditExpense } from '../../../models/InfoCreditExpense';
import { FormaterService } from '../../../services/formater.service';

@Component({
  selector: 'app-invoice-details-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, CommonModule],
  templateUrl: './invoice-details-dialog.component.html',
  styleUrl: './invoice-details-dialog.component.scss',
})
export class InvoiceDetailsDialogComponent implements OnInit {
  creditExpenses$!: Observable<InfoCreditExpense[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; invoiceId: number },
    public dialogRef: MatDialogRef<InvoiceDetailsDialogComponent>,
    private readonly creditCardService: CreditCardService,
    public formaterService: FormaterService
  ) {}

  ngOnInit(): void {
    this.creditExpenses$ = this.creditCardService.getCreditExpensesFromInvoice(
      this.data.invoiceId
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
