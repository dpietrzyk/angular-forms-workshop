import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedFormComponent } from './components/extended-form/extended-form.component';
import { FakeApiService } from './services/fake-api/fake-api.service';
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
    ReactiveFormsModule,
  ],
  providers: [
    FakeApiService,
  ],
})
export class ExtendedFormModule {}
