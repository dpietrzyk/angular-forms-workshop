import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from './base-form/base-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BaseFormComponent,
  ],
  exports: [
    BaseFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class BaseFormModule {}
