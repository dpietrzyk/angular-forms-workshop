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

  public ngAfterViewInit(): void {
    this.restoreDataAfterFormInit();
    this.saveDataAfterChange();
  }

  private restoreDataAfterFormInit(): void {
    this.formRef?.valueChanges?.pipe(debounceTime(50), first()).subscribe((e) => {
      const savedData = JSON.parse(localStorage.getItem(BaseFormComponent.LS_FORM_KEY) || '{}');
      this.formRef?.form.patchValue(savedData);
      this.formRef?.form.updateValueAndValidity();
    });
  }

  private saveDataAfterChange(): void {
    this.formRef?.valueChanges?.pipe(debounceTime(50)).subscribe((e) => {
      localStorage.setItem(BaseFormComponent.LS_FORM_KEY, JSON.stringify(e));
      console.log(e);
    });
  }

  onSubmit(form: NgForm): void {
    console.log(form.form);
  }

  public clearForm(): void {
    this.formRef?.resetForm();
  }

}
