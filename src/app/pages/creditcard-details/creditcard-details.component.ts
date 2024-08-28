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

    const actualInvoiceDate = new Date();
    actualInvoiceDate.setDate(1);
    actualInvoiceDate.setHours(0,0,0,0);

    const isAfterOrInClosingDate =
      today.getDate() >= invoice.closingDate.getDate();

    if (isAfterOrInClosingDate) {
      actualInvoiceDate.setMonth(actualInvoiceDate.getMonth() + 1);
    }

    return actualInvoiceDate.getTime() === invoice.invoiceDate.getTime();
  }

  isOverdueInvoice(invoice: InfoInvoiceResponse): boolean {
    const today = new Date();

    const actualInvoiceDate = new Date();
    actualInvoiceDate.setDate(1);
    actualInvoiceDate.setHours(0, 0, 0, 0);

    if(actualInvoiceDate.getFullYear() > invoice.invoiceDate.getFullYear())
      return true;
    else if (actualInvoiceDate.getFullYear() < invoice.invoiceDate.getFullYear())
      return false;

    if(actualInvoiceDate.getMonth() > invoice.invoiceDate.getMonth())
      return true;
    else if (actualInvoiceDate.getMonth() < invoice.invoiceDate.getMonth())
      return false;


    if (today.getDate() >= invoice.closingDate.getDate())
      return true;
    return false;
  }
}
