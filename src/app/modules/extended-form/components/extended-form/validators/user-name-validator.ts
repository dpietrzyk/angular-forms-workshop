import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UserNameValidators {
  private static readonly FORBIDDEN_USERNAMES = ['admin', 'root'];

  static isNameNotForbidden(control: AbstractControl): ValidationErrors | null {
    return UserNameValidators.FORBIDDEN_USERNAMES.includes(control.value) ? { invalidUsername: true } : null;
  }
}
