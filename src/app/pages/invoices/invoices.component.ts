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
    const paramId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);

    this.creditCardService.getInvoicesById(paramId).subscribe({
      next: (value) => {
        this.invoice = value.invoice;
        console.log(value);
        this.nextInvoiceId = value.nextInvoiceId;
        this.prevInvoiceId = value.prevInvoiceId;
      },
    });
  }

  openPaymentInvoiceDialog() {
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

  nextInvoice() {
    if (this.nextInvoiceId) {
      this.router.navigate(['/invoices', this.nextInvoiceId]);
    }
  }

  prevInvoice() {
    if (this.prevInvoiceId) {
      this.router.navigate(['/invoices', this.prevInvoiceId]);
    }
  }
}
