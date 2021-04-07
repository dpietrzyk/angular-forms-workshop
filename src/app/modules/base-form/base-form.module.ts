import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from './base-form/base-form.component';

@NgModule({
  declarations: [
    BaseFormComponent,
  ],
  exports: [
    BaseFormComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class BaseFormModule {}
