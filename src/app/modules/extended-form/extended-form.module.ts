import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedFormComponent } from './components/extended-form/extended-form.component';

@NgModule({
  declarations: [
    ExtendedFormComponent,
  ],
  exports: [
    ExtendedFormComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
})
export class ExtendedFormModule {}
