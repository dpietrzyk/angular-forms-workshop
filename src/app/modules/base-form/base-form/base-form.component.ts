import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
})
export class BaseFormComponent implements AfterViewInit {
  private static readonly LS_FORM_KEY = 'saved-form';

  @ViewChild('formRef')
  formRef: NgForm | undefined;

  details = '';

  ngAfterViewInit(): void {
    this.restoreDataAfterFormInit();
    this.saveDataAfterChange();
  }

  onSubmit(form: NgForm): void {
    console.log(form.form);
  }

  clearForm(): void {
    this.formRef?.resetForm();
  }

  private restoreDataAfterFormInit(): void {
    this.formRef?.valueChanges?.pipe(debounceTime(50), first()).subscribe(() => {
      const savedRawData = localStorage.getItem(BaseFormComponent.LS_FORM_KEY);
      if (!savedRawData) {
        return;
      }

      const savedData = JSON.parse(savedRawData);
      this.formRef?.form.patchValue(savedData);
      this.formRef?.form.markAllAsTouched();
    });
  }

  private saveDataAfterChange(): void {
    this.formRef?.valueChanges?.pipe(debounceTime(50)).subscribe((e) => {
      if (this.formRef?.pristine) {
        return;
      }

      localStorage.setItem(BaseFormComponent.LS_FORM_KEY, JSON.stringify(e));
      console.log(e);
    });
  }

}
