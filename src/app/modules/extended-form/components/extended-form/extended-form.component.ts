import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-extended-form',
  templateUrl: './extended-form.component.html',
  styleUrls: ['./extended-form.component.scss'],
})

export class ExtendedFormComponent {
  details = '';

  form: FormGroup = new FormGroup({
    userData: new FormGroup({
      name: new FormControl(''),
    }),
  });

  onSubmit(): void {
    console.log(this.form);
  }

  clearForm(): void {
    console.log('clearForm');
    this.form.reset();
  }
}
