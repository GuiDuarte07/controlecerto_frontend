import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
})
export class CurrencyMaskDirective implements OnInit {
  @Input() prefix: string = '';
  @Input() thousandSeparator: string = '.';
  @Input() decimalMarker: string = ',';
  @Input() decimalPlaces: number = 2;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    console.log(event);
    const input = event.target! as HTMLInputElement;
    input.value = this.formatInput(input.value);
  }

  ngOnInit(): void {
    // Adiciona imediatamente o préfixo
    this.el.nativeElement.value = this.formatInput(this.el.nativeElement.value);
  }

  private formatInput(value: string): string {
    let numbersOnly = value.replace(/\D/g, '');

    if (numbersOnly[0] == '0') {
      numbersOnly = numbersOnly.slice(1, numbersOnly.length);
    }

    while (numbersOnly.length <= this.decimalPlaces) {
      numbersOnly = '0' + numbersOnly;
    }

    const integerPart = numbersOnly.slice(0, -this.decimalPlaces);
    const decimalPart = numbersOnly.slice(-this.decimalPlaces);

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.thousandSeparator
    );

    return `${this.prefix}${formattedIntegerPart}${this.decimalMarker}${decimalPart}`;
  }
}
