import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BaseFormModule } from './modules/base-form/base-form.module';
import { ExtendedFormModule } from './modules/extended-form/extended-form.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BaseFormModule,
    ExtendedFormModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
