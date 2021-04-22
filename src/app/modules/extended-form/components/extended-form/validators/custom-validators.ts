import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  private static readonly FORBIDDEN_NAMES = ['admin'];

  static isAllowedName(control: AbstractControl): ValidationErrors | null {
    if (CustomValidators.FORBIDDEN_NAMES.includes(control.value)) {
      return { nameNotAllowed: true };
    }

    return null;
  }
}
