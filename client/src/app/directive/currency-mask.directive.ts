import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true,
    },
  ],
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  @Input() prefix: string = '';
  @Input() thousandSeparator: string = '';
  @Input() decimalMarker: string = ',';
  @Input() decimalPlaces: number = 2;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatInput(input.value);
    input.value = formattedValue;
    //this.onChange(this.parseInput(formattedValue));
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: any): void {
    const formattedValue = this.formatInicialValue(value);
    this.el.nativeElement.value = formattedValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public formatInput(value: string): string {
    let numString = value;

    if (!numString.includes(this.decimalMarker)) {
      for (let i = 0; i < this.decimalPlaces; i++) {
        numString += '0';
      }
    }

    let numbersOnly = numString.replace(/\D/g, '');

    // Remove leading zeros
    numbersOnly = numbersOnly.replace(/^0+/, '');

    // Ensure there are at least `decimalPlaces` digits
    while (numbersOnly.length <= this.decimalPlaces) {
      numbersOnly = '0' + numbersOnly;
    }

    const integerPart = numbersOnly.slice(0, -this.decimalPlaces);
    const decimalPart = numbersOnly.slice(-this.decimalPlaces);

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.thousandSeparator
    );

    const formatedNumber = `${this.prefix}${formattedIntegerPart}${this.decimalMarker}${decimalPart}`;

    return formatedNumber;
  }


  private formatInicialValue (value?: number): string {

    let numString = value ? value.toFixed(2).toString() : '0';

    numString = numString.replace('.', this.decimalMarker);

    return this.formatInput(numString);
  }
}
