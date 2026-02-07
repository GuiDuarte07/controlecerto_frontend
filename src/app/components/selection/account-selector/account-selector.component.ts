import {
  Component,
  Input,
  forwardRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/AccountRequest ';

@Component({
  selector: 'app-account-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountSelectorComponent),
      multi: true,
    },
  ],
  templateUrl: './account-selector.component.html',
  styleUrl: './account-selector.component.scss',
})
export class AccountSelectorComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() label = 'Conta';
  @Input() placeholder = 'Selecione uma conta';
  @Input() required = false;

  accounts: Account[] = [];
  selectControl = new FormControl<number | null>(null);
  selectedAccount?: Account;
  loading = false;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSelectionChange() {
    const selectedId = this.selectControl.value;
    this.selectedAccount = this.accounts.find((acc) => acc.id === selectedId);
    this.onChange(selectedId);
    this.onTouched();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accounts'] && this.selectControl.value) {
      this.selectedAccount = this.accounts.find(
        (acc) => acc.id === this.selectControl.value,
      );
      this.cdr.markForCheck();
    }
  }

  writeValue(value: number | null): void {
    this.selectControl.setValue(value, { emitEvent: false });
    if (value) {
      this.selectedAccount = this.accounts.find((acc) => acc.id === value);
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.selectControl.disable() : this.selectControl.enable();
  }
}
