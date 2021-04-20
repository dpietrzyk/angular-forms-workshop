import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FakeApiService } from '../../services/fake-api/fake-api.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { UserNameValidators } from './validators/user-name-validator';

@Component({
  selector: 'app-extended-form',
  templateUrl: './extended-form.component.html',
  styleUrls: ['./extended-form.component.scss'],
})

export class ExtendedFormComponent implements OnInit {
  private static readonly LS_FORM_KEY = 'saved-form';
  private readonly forbiddenUsernames = ['admin', 'root'];

  form: FormGroup = new FormGroup({
    userData: new FormGroup({
      name: new FormControl('', [
          Validators.required,
          this.isNameNotForbidden.bind(this),
          UserNameValidators.isNameNotForbidden,
        ],
        this.isNameAllowed.bind(this)),
      email: new FormControl('', [Validators.required, Validators.email]),
    }),
    phone: new FormControl('', Validators.pattern(/\d{3}-\d{3}-\d{3}$/)),
    country: new FormControl(''),
    newsletter: new FormControl(false),
    sex: new FormControl(''),
    description: new FormControl(''),
    friends: new FormArray([]),
  });

  get friends(): AbstractControl[] {
    return (this.form.get('friends') as FormArray)?.controls || [];
  }

  constructor(private readonly fakeApi: FakeApiService) { }

  ngOnInit(): void {
    this.restoreDataAfterFormInit();
    this.saveDataAfterChange();
    this.formatPhoneNumber();
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  clearForm(): void {
    this.form.reset();
    (this.form.get('friends') as FormArray | undefined)?.clear();
    localStorage.removeItem(ExtendedFormComponent.LS_FORM_KEY);
  }

  shouldShowError(name: string, errorName: string): boolean {
    const control = this.form.get(name);
    return !!(control?.touched && control.errors?.[errorName]);
  }

  isInvalidAndTouched(name: string): boolean {
    const control = this.form.get(name);
    return !!(control?.invalid && control?.touched);
  }

  addFriend(): void {
    (this.form.get('friends') as FormArray | undefined)?.push(this.createDefaultFriendFormControl());
  }

  private createDefaultFriendFormControl(): FormControl {
    return new FormControl('', Validators.required);
  }

  private isNameNotForbidden(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenUsernames.includes(control.value) ? { invalidUsername: true } : null;
  }

  private isNameAllowed(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.fakeApi.isAllowedName(control.value).pipe(map(isAllowedName => isAllowedName ? null : { invalidUsername: true }));
  }

  private saveDataAfterChange(): void {
    this.form.valueChanges.subscribe((e) => {
      if (this.form.pristine) {
        return;
      }

      localStorage.setItem(ExtendedFormComponent.LS_FORM_KEY, JSON.stringify(e));
      console.log(e);
    });
  }

  private restoreDataAfterFormInit(): void {
    const savedDataRaw = localStorage.getItem(ExtendedFormComponent.LS_FORM_KEY);
    if (!savedDataRaw) {
      return;
    }

    const savedData = JSON.parse(savedDataRaw);
    const friends = savedData?.friends || [];

    for (const friend of friends) {
      (this.form.get('friends') as FormArray | undefined)?.push(this.createDefaultFriendFormControl());
    }

    this.form.patchValue(savedData);
    this.form.markAllAsTouched();
  }

  private formatPhoneNumber(): void {
    const control = this.form.get('phone');
    if (!control) {
      return;
    }

    const shouldSkipPrefix = (phoneNumber: string) => (phoneNumber.length + 1) % 4;
    const prefixIfNeeded = (phoneNumber: string) => shouldSkipPrefix(phoneNumber) ? '' : '-';
    const formatPhoneNumberReducer = (phoneNumber: string, digit: string) => phoneNumber + prefixIfNeeded(phoneNumber) + digit;

    const mapInputToPhoneNumber = (val: string | null) => (val || '')
      .replaceAll('-', '')
      .slice(0, 9)
      .split('')
      .reduce(formatPhoneNumberReducer, '');

    control
      .valueChanges
      .pipe(
        distinctUntilChanged(),
        map(mapInputToPhoneNumber),
      ).subscribe(
      phoneNumber => control.patchValue(phoneNumber),
    );
  }
}
