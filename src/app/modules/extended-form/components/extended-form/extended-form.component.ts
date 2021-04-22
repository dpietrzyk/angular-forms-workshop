import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomValidators } from './validators/custom-validators';
import { Observable } from 'rxjs';
import { FakeApiService } from '../../services/fake-api/fake-api.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-extended-form',
  templateUrl: './extended-form.component.html',
  styleUrls: ['./extended-form.component.scss'],
})
export class ExtendedFormComponent implements OnInit {
  private static readonly LS_FORM_KEY = 'saved-form';

  // private forbiddenNames = ['admin'];

  constructor(
    private readonly fakeApi: FakeApiService,
  ) { }

  form: FormGroup = new FormGroup({
    userData: new FormGroup({
      name: new FormControl('',
        [
          Validators.required,
          // this.isAllowedName.bind(this),
          CustomValidators.isAllowedName,
        ],
        this.isNotRegisterUser.bind(this),
      ),
      email: new FormControl('',
        [Validators.required, Validators.email],
      ),
    }),
    phone: new FormControl('', Validators.pattern(/\d{3}-\d{3}-\d{3}$/)),
    country: new FormControl('pol'),
    newsletter: new FormControl(false),
    sex: new FormControl('female'),
    description: new FormControl(''),
    friends: new FormArray([]),
  });

  get friends(): FormArray | undefined {
    return (this.form.get('friends') as FormArray | undefined);
  }

  ngOnInit(): void {
    this.restoreDataFromStorage();
    this.saveDataToStorageOnFormChange();
    this.formatPhoneOnInputChange();
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  clearForm(): void {
    this.form.reset();
    this.friends?.clear();
    localStorage.removeItem(ExtendedFormComponent.LS_FORM_KEY);
  }

  shouldShowError(name: string, errorName: string): boolean {
    const control = this.form.get(name);
    return control?.touched && control?.errors?.[errorName];
  }

  addFriend(): void {
    const friends: FormArray | null = (this.form.get('friends') as FormArray | null);
    const friendControl = new FormControl('', Validators.required);
    friends?.push(friendControl);
  }

  // private isAllowedName(control: AbstractControl): ValidationErrors | null {
  //   if (this.forbiddenNames.includes(control.value)) {
  //     return { nameNotAllowed: true };
  //   }
  //
  //   return null;
  // }

  private isNotRegisterUser(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.fakeApi
      .isAllowedName(control.value)
      .pipe(
        map(isAllowedName => isAllowedName ? null : { registeredUser: true }),
      );
  }

  private restoreDataFromStorage(): void {
    const savedDataRaw = localStorage.getItem(ExtendedFormComponent.LS_FORM_KEY);
    if (!savedDataRaw) {
      return;
    }

    const savedData = JSON.parse(savedDataRaw);
    const friends = savedData?.friends || [];

    for (const friend of friends) {
      this.addFriend();
    }

    this.form.patchValue(savedData);
    this.form.markAllAsTouched();
  }

  private saveDataToStorageOnFormChange(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.pristine) {
        return;
      }

      localStorage.setItem(ExtendedFormComponent.LS_FORM_KEY, JSON.stringify(val));
    });
  }

  private formatPhoneOnInputChange(): void {
    const control = this.form.get('phone');
    if (!control) {
      return;
    }

    control.valueChanges.pipe(
      distinctUntilChanged(),
      map(val => this.formatPhoneNumber(val)),
    ).subscribe((formattedPhoneNumber) =>
      control.patchValue(formattedPhoneNumber),
    );
  }

  // 000-000-000 => 000000000 => 000-000-000
  // 123-456-789 => 123456789 => 123-456-789
  private formatPhoneNumber(val: string): string {
    // '' + '1';
    // '1' + '2'
    // '12' + '3'
    // '123' + '4'
    // '123-4' + '5'

    const shouldShipPrefix = (phoneNumber: string) => (phoneNumber.length + 1) % 4;
    const prefixIfNeeded = (phoneNumber: string) => shouldShipPrefix(phoneNumber) ? '' : '-';
    const formatNumber = (phoneNumber: string, digt: string) => phoneNumber + prefixIfNeeded(phoneNumber) + digt;

    return val
      .replaceAll('-', '')
      .slice(0, 9)
      .split('')
      .reduce(formatNumber, '');
  }
}
