import { Observable } from 'rxjs';
import { CreditCardService } from './../../services/credit-card.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditCardInfo } from '../../models/CreditCardInfo';
import { CommonModule } from '@angular/common';
import { CreateCreditCardDialogComponent } from '../../components/dialogs/create-credit-card-dialog/create-credit-card-dialog.component';
import { RouterModule } from '@angular/router';
import { RegisterButtonComponent } from '../../components/ui/register-button/register-button.component';

@Component({
  selector: 'app-creditcards',
  standalone: true,
  imports: [
    CreateCreditCardDialogComponent,
    CommonModule,
    RouterModule,
    RegisterButtonComponent,
  ],
  templateUrl: './creditcards.component.html',
  styleUrl: './creditcards.component.scss',
})
export class CreditcardsComponent implements OnInit {
  @ViewChild('createCreditCardDialog')
  createCreditCardDialog!: CreateCreditCardDialogComponent;

  $creditCards!: Observable<CreditCardInfo[]>;
  day = new Date().getDate();

  constructor(private creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.updatedCreditCards();
  }

  updatedCreditCards() {
    this.$creditCards = this.creditCardService.getCreditCards();
  }

  /* openAccountDialog(account?: Account) {
    let dialogData: AccountDialogDataType;

    if (account) {
      dialogData = {
        newAccount: false,
        account,
      };
    } else {
      dialogData = { newAccount: true };
    }

    this.createCreditCardDialog.openDialog(dialogData);

    this.createCreditCardDialog.closeEvent.subscribe((success: boolean) => {
      if ((success as boolean) === true) {
        this.updatedAccounts();
      }
    });
  } */

  openCreditCardDialog(data?: CreditCardInfo) {
    this.createCreditCardDialog.openDialog(data);
    this.createCreditCardDialog.closeEvent.subscribe((success: boolean) => {
      if ((success as boolean) === true) {
        this.updatedCreditCards();
      }
    });
  }

  /* formatDateString(dateString: string | Date): string {
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
  } */
}
