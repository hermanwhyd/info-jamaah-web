import { NgModule } from '@angular/core';
import { SetupEnumComponent } from './setup-enum.component';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { SetupEnumEditModule } from '../setup-enum-edit/setup-enum-edit.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonLoadingModule } from 'src/app/shared/utilities/mat-button-loading/mat-button-loading.module';
import { ConfirmationDialogModule } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.module';

@NgModule({
  declarations: [SetupEnumComponent],
  exports: [SetupEnumComponent],
  imports: [
    SharedModule,
    SnackBarNotifModule,
    SetupEnumEditModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    ConfirmationDialogModule
  ]
})
export class SetupEnumModule { }
