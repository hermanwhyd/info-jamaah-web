import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatListModule } from '@angular/material/list';
import { SetupEnumModule } from './components/setup-enum/setup-enum.module';
import { SetupTagModule } from './components/setup-tag/setup-tag.module';
import { SetupCustomFieldModule } from './components/setup-custom-field/setup-custom-field.module';

@NgModule({
  declarations: [SetupComponent],
  imports: [
    CommonModule,
    SetupRoutingModule,
    FlexLayoutModule,
    ContainerModule,
    PageLayoutModule,
    MatListModule,
    MatRippleModule,

    SetupEnumModule,
    SetupTagModule,
    SetupCustomFieldModule
  ]
})
export class SetupModule { }
