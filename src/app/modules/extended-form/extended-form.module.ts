import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedFormComponent } from './components/extended-form/extended-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ExtendedFormComponent,
  ],
  exports: [
    ExtendedFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
})
export class ExtendedFormModule {}
