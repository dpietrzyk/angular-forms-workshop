import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
})
export class BaseFormComponent {
  @ViewChild('formRef')
  formRef: NgForm | undefined;

  details = '';

  onSubmit(form: NgForm): void {
    console.log(form.form);
  }

  clearForm(): void {
    this.formRef?.resetForm();
  }
}
