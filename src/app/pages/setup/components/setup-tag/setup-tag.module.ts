import { NgModule } from '@angular/core';
import { SetupTagComponent } from './setup-tag.component';
import { SharedModule } from 'src/app/common/shared.module';
import { SnackBarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { SetupEnumEditModule } from '../setup-enum-edit/setup-enum-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';

@NgModule({
  declarations: [SetupTagComponent],
  exports: [SetupTagComponent],
  imports: [
    SharedModule,
    SnackBarNotifModule,
    SetupEnumEditModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    ConfirmationDialogModule
  ]
})
export class SetupTagModule { }
