import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-extended-form',
  templateUrl: './extended-form.component.html',
  styleUrls: ['./extended-form.component.scss'],
})
export class ExtendedFormComponent implements OnInit {
  private static readonly LS_FORM_KEY = 'saved-form';

  details = '';

  form: FormGroup = new FormGroup({
    userData: new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('',
        [Validators.required, Validators.email],
      ),
    }),
    phone: new FormControl('', Validators.pattern(/\d{3}-\d{3}-\d{3}$/)),
    country: new FormControl('pol'),
    newsletter: new FormControl(false),
    sex: new FormControl('female'),
    description: new FormControl(''),
  });

  ngOnInit(): void {
    this.restoreDataFromStorage();
    this.saveDataToStorageOnFormChange();
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  clearForm(): void {
    this.form.reset();
    localStorage.removeItem(ExtendedFormComponent.LS_FORM_KEY);
  }

  shouldShowError(name: string, errorName: string): boolean {
    const control = this.form.get(name);
    return control?.touched && control?.errors?.[errorName];
  }

  private restoreDataFromStorage(): void {
    const savedDataRaw = localStorage.getItem(ExtendedFormComponent.LS_FORM_KEY);
    if (!savedDataRaw) {
      return;
    }

    const savedData = JSON.parse(savedDataRaw);
    this.form.patchValue(savedData);
    this.form.markAllAsTouched();
  }

  private saveDataToStorageOnFormChange(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.pristine) {
        return;
      }

      localStorage.setItem(ExtendedFormComponent.LS_FORM_KEY, JSON.stringify(val));
      console.log(val);
    });
  }
}
