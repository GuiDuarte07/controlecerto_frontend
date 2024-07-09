import { Component } from '@angular/core';
import { FormaterService } from '../../services/formater.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardService } from '../../services/credit-card.service';
import { MatDialog } from '@angular/material/dialog';
import { CreditCardInfo } from '../../models/CreditCardInfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creditcard-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditcard-details.component.html',
  styleUrl: './creditcard-details.component.scss',
})
export class CreditcardDetailsComponent {
  creditCardId!: number;
  creditCard!: CreditCardInfo;

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
}
