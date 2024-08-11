import { FormaterService } from './../../services/formater.service';
import { CreditCardService } from './../../services/credit-card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InvoicePaymentDialogComponent } from '../../components/dialogs/invoice-payment-dialog/invoice-payment-dialog.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent implements OnInit {
  invoiceId!: number;
  invoice!: InfoInvoiceResponse;
  nextInvoiceId?: number;
  prevInvoiceId?: number;

  constructor(
    private creditCardService: CreditCardService,
    public formaterService: FormaterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.invoiceId = parseInt(params.get('id')!);
      this.updateInvoice();
    });
  }

  updateInvoice(): void {
    const paramId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);

    this.creditCardService.getInvoicesById(paramId).subscribe({
      next: (value) => {
        this.invoice = value.invoice;
        this.nextInvoiceId = value.nextInvoiceId;
        this.prevInvoiceId = value.prevInvoiceId;

        console.log(value);
      },
    });
  }

  openPaymentInvoiceDialog(): void {
    const dialogRef = this.dialog.open(InvoicePaymentDialogComponent, {
      data: {
        invoice: this.invoice,
      },
    });

    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        /* this.updateTransactions(); */
      }
    });
  }

  isActualInvoice(): boolean {
    const today = new Date();
    return (
      (today.getFullYear() === this.invoice.closingDate.getFullYear() &&
        today.getMonth() === this.invoice.closingDate.getMonth() &&
        today.getDate() < this.invoice.closingDate.getDate()) ||
      (today.getFullYear() === this.invoice.closingDate.getFullYear() &&
        today.getMonth() + 1 === this.invoice.closingDate.getMonth()) ||
      (today.getFullYear() + 1 === this.invoice.closingDate.getFullYear() &&
        0 === this.invoice.closingDate.getMonth() &&
        today.getDate() < this.invoice.closingDate.getDate())
    );
  }

  isOverdueInvoice(): boolean {
    const today = new Date();
    return (
      (today.getFullYear() == this.invoice.closingDate.getFullYear() &&
        today.getMonth() == this.invoice.closingDate.getMonth() &&
        today.getDate() >= this.invoice.closingDate.getDate()) ||
      (today.getFullYear() > this.invoice.closingDate.getFullYear() &&
        today.getMonth() > this.invoice.closingDate.getMonth())
    );
  }

  totalPayment(): number {
    return (
      this.invoice.invoicePayments?.reduce(
        (acc, payments) => acc + payments.amountPaid,
        0
      ) ?? 0
    );
  }

  nextInvoice(): void {
    if (this.nextInvoiceId) {
      this.router.navigate(['/invoices', this.nextInvoiceId]);
      this;
    }
  }

  prevInvoice(): void {
    if (this.prevInvoiceId) {
      this.router.navigate(['/invoices', this.prevInvoiceId]);
    }
  }
}
