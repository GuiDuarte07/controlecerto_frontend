import { Observable } from 'rxjs';
import { CreditCardService } from './../../../services/credit-card.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { InfoInvoiceResponse } from '../../../models/InfoInvoiceResponse';
import { InvoiceDetailsDialogComponent } from '../invoice-details-dialog/invoice-details-dialog.component';

@Component({
  selector: 'app-invoices-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, CommonModule],
  templateUrl: './invoices-dialog.component.html',
  styleUrl: './invoices-dialog.component.scss',
})
export class InvoicesDialogComponent implements OnInit {
  invoices$!: Observable<InfoInvoiceResponse[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { accountId: number },
    public myDialogRef: MatDialogRef<InvoicesDialogComponent>,
    public dialogRef: MatDialog,
    private readonly creditCardService: CreditCardService
  ) {}

  ngOnInit(): void {
    this.invoices$ = this.creditCardService.getInvoices(this.data.accountId);

    this.invoices$.subscribe((d) => console.log(d));
  }

  closeDialog() {
    this.myDialogRef.close();
  }

  openInvoiceDetailsDialog(title: string, invoiceId: number) {
    this.dialogRef.open(InvoiceDetailsDialogComponent, {
      data: {
        title,
        invoiceId,
      },
    });
  }

  getMonthYearString(date: Date): string {
    const formattedDate = date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    // Deixa a primeira letra do mês em maiúsculo
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  isActualMonth(date: Date): 'past' | 'present' | 'future' {
    let today = new Date();

    if (
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    )
      return 'present';

    if (date < today) return 'past';

    return 'future';
  }
}
