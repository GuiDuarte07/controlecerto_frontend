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
export class CurrencyMaskDirective implements OnInit, ControlValueAccessor {
  @Input() prefix: string = '';
  @Input() thousandSeparator: string = '';
  @Input() decimalMarker: string = ',';
  @Input() decimalPlaces: number = 2;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatInput(input.value);
    input.value = formattedValue;
    this.onChange(this.parseInput(formattedValue));
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  /*
   * NOT WORKING CORRECTLY FOR FORMCONTROL INITIAL VALUES
   */
  ngOnInit(): void {
    const initialValue = this.el.nativeElement.value;
    const formattedValue = this.formatInput(initialValue);
    this.el.nativeElement.value = formattedValue;
    this.onChange(this.parseInput(formattedValue));
  }

  writeValue(value: any): void {
    console.log(value);
    const formattedValue = this.formatInput(value ? value.toString() : '');
    console.log(formattedValue);
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

    return `${this.prefix}${formattedIntegerPart}${this.decimalMarker}${decimalPart}`;
  }

  public parseInput(value: string): number {
    let parsedValue = value;

    // Remove prefix
    if (this.prefix) {
      parsedValue = parsedValue.replace(this.prefix, '');
    }

    // Remove thousand separators
    if (this.thousandSeparator) {
      const regex = new RegExp(`\\${this.thousandSeparator}`, 'g');
      parsedValue = parsedValue.replace(regex, '');
    }

    // Replace decimal marker with dot
    if (this.decimalMarker) {
      const regex = new RegExp(`\\${this.decimalMarker}`);
      parsedValue = parsedValue.replace(regex, '.');
    }

    // Convert to float
    return parseFloat(parsedValue);
  }
}
