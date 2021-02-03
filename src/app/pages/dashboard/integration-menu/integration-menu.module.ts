import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IntegrationMenuComponent } from './integration-menu.component';

@NgModule({
  declarations: [IntegrationMenuComponent],
  exports: [IntegrationMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class IntegrationMenuModule { }
