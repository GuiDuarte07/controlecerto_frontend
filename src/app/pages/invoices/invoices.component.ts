import { FormaterService } from './../../services/formater.service';
import { CreditCardService } from './../../services/credit-card.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { InvoicePaymentDialogComponent } from '../../components/dialogs/invoice-payment-dialog/invoice-payment-dialog.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, InvoicePaymentDialogComponent, ChipModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent implements OnInit {
  @ViewChild('invoicePaymentDialog')
  invoicePaymentDialog!: InvoicePaymentDialogComponent;

  invoiceId!: number;
  invoice!: InfoInvoiceResponse;
  nextInvoiceId?: number;
  prevInvoiceId?: number;

  constructor(
    private creditCardService: CreditCardService,
    public formaterService: FormaterService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
      },
    });
  }

  openPaymentInvoiceDialog() {
    this.invoicePaymentDialog.openDialog({ invoice: this.invoice });
    this.invoicePaymentDialog.closeEvent.subscribe((success: boolean) => {
      if (success === true) {
        this.updateInvoice();
      }
    });
  }

  isActualInvoice(): boolean {
    const today = new Date();

    const actualInvoiceDate = new Date();
    actualInvoiceDate.setDate(1);
    actualInvoiceDate.setHours(0, 0, 0, 0);

    const isAfterOrInClosingDate =
      today.getDate() >= this.invoice.closingDate.getDate();

    if (isAfterOrInClosingDate) {
      actualInvoiceDate.setMonth(actualInvoiceDate.getMonth() + 1);
    }

    return actualInvoiceDate.getTime() === this.invoice.invoiceDate.getTime();
  }

  isOverdueInvoice(): boolean {
    const today = new Date();

    const actualInvoiceDate = new Date();
    actualInvoiceDate.setDate(1);
    actualInvoiceDate.setHours(0, 0, 0, 0);

    if (
      actualInvoiceDate.getFullYear() > this.invoice.invoiceDate.getFullYear()
    )
      return true;
    else if (
      actualInvoiceDate.getFullYear() < this.invoice.invoiceDate.getFullYear()
    )
      return false;

    if (actualInvoiceDate.getMonth() > this.invoice.invoiceDate.getMonth())
      return true;
    else if (actualInvoiceDate.getMonth() < this.invoice.invoiceDate.getMonth())
      return false;

    if (today.getDate() >= this.invoice.closingDate.getDate()) return true;
    return false;
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
