import { Component } from '@angular/core';
import { FormaterService } from '../../services/formater.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreditCardService } from '../../services/credit-card.service';
import { MatDialog } from '@angular/material/dialog';
import { CreditCardInfo } from '../../models/CreditCardInfo';
import { CommonModule } from '@angular/common';
import { InfoInvoiceResponse } from '../../models/InfoInvoiceResponse';
import { CreateCreditCardDialogComponent } from '../../components/dialogs/create-credit-card-dialog/create-credit-card-dialog.component';

@Component({
  selector: 'app-creditcard-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './creditcard-details.component.html',
  styleUrl: './creditcard-details.component.scss',
})
export class CreditcardDetailsComponent {
  creditCardId!: number;
  creditCard!: CreditCardInfo;
  invoices: InfoInvoiceResponse[] = [];

  constructor(
    private creditCardService: CreditCardService,
    public formaterService: FormaterService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.creditCardId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );

    this.updateCreditCard();
    this.updateInvoice();
  }

  updateCreditCard(): void {
    this.creditCardService.getCreditCards().subscribe({
      next: (value) => {
        this.creditCard = value.find(
          (creditCard) => creditCard.id === this.creditCardId
        )!;

        if (this.creditCard === undefined) {
          this.router.navigate(['registrations', 'creditcards']);
        }
      },
    });
  }

  updateInvoice(): void {
    this.creditCardService.getInvoices(this.creditCardId).subscribe({
      next: (value) => {
        this.invoices = value;
      },
    });
  }

  openCreditCardDialog() {
    const dialogRef = this.dialog.open(CreateCreditCardDialogComponent, {
      data: {
        newCreditCard: false,
        creditCard: this.creditCard,
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateCreditCard();
      }
    });
  }

  isActualInvoice(invoice: InfoInvoiceResponse): boolean {
    const today = new Date();
    return (
      (today.getFullYear() === invoice.closingDate.getFullYear() &&
        today.getMonth() === invoice.closingDate.getMonth() &&
        today.getDate() < invoice.closingDate.getDate()) ||
      (today.getFullYear() === invoice.closingDate.getFullYear() &&
        today.getMonth() + 1 === invoice.closingDate.getMonth()) ||
      (today.getFullYear() + 1 === invoice.closingDate.getFullYear() &&
        0 === invoice.closingDate.getMonth() &&
        today.getDate() < invoice.closingDate.getDate())
    );
  }

  isOverdueInvoice(invoice: InfoInvoiceResponse): boolean {
    const today = new Date();
    return (
      (today.getFullYear() === invoice.closingDate.getFullYear() &&
        today.getMonth() === invoice.closingDate.getMonth() &&
        today.getDate() >= invoice.closingDate.getDate()) ||
      (today.getFullYear() > invoice.closingDate.getFullYear() &&
        today.getMonth() > invoice.closingDate.getMonth())
    );
  }
}
