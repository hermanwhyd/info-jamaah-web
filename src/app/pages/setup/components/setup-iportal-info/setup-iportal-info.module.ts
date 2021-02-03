import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupIportalInfoComponent } from './setup-iportal-info.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackbarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';


@NgModule({
  declarations: [SetupIportalInfoComponent],
  exports: [SetupIportalInfoComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    IconModule,
    SnackbarNotifModule
  ]
})
export class SetupIportalInfoModule { }
