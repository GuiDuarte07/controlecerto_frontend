import { Observable } from 'rxjs';
import { CreditCardService } from './../../services/credit-card.service';
import { Component, OnInit } from '@angular/core';
import { CreditCardInfo } from '../../models/CreditCardInfo';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-creditcards',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './creditcards.component.html',
  styleUrl: './creditcards.component.scss',
})
export class CreditcardsComponent implements OnInit {
  $creditCards!: Observable<CreditCardInfo[]>;

  constructor(private creditCardService: CreditCardService) {}

  ngOnInit(): void {
    this.$creditCards = this.creditCardService.getCreditCards();
    this.$creditCards.subscribe((d) => console.log(d));
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
