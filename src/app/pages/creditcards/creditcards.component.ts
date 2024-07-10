import { Observable } from 'rxjs';
import { CreditCardService } from './../../services/credit-card.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CreditCardInfo } from '../../models/CreditCardInfo';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';
import { MatDialog } from '@angular/material/dialog';
import { CreateCreditCardDialogComponent } from '../../components/dialogs/create-credit-card-dialog/create-credit-card-dialog.component';
import { InvoicesDialogComponent } from '../../components/dialogs/invoices-dialog/invoices-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-creditcards',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './creditcards.component.html',
  styleUrl: './creditcards.component.scss',
})
export class CreditcardsComponent implements OnInit {
  $creditCards!: Observable<CreditCardInfo[]>;
  day = new Date().getDate();

  constructor(
    private creditCardService: CreditCardService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updatedCreditCards();

    let accountId: number;
    this.$creditCards.subscribe((d) => {
      accountId = d[0].account.id;
      this.creditCardService.getInvoices(accountId).subscribe({
        next: (v) => {
          console.log(v);
        },
      });
    });
  }

  updatedCreditCards() {
    this.$creditCards = this.creditCardService.getCreditCards();
  }

  openCreditCardDialog() {
    const dialogRef = this.dialog.open(CreateCreditCardDialogComponent, {
      data: {
        newCreditCard: true,
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updatedCreditCards();
      }
    });
  }

  openInvoicesDialog(accountId: number) {
    this.dialog.open(InvoicesDialogComponent, {
      data: {
        accountId,
      },
    });
  }

  formatDateString(dateString: string | Date): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;

    // Remove time part from dates for comparison
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Hoje';
    } else if (isYesterday) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        month: 'long',
        day: 'numeric',
      });
    }
  }
}
