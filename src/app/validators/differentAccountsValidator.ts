import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function differentAccountsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const accountOriginId = control.get('accountOriginId')?.value;
    const accountDestinyId = control.get('accountDestinyId')?.value;

    if (accountOriginId && accountDestinyId && accountOriginId === accountDestinyId) {
      return { sameAccounts: true };
    }

    return null;
  };
}
