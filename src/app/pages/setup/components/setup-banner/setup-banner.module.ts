import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/common/shared.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { SnackbarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { SetupEnumEditModule } from '../setup-enum-edit/setup-enum-edit.module';
import { SetupBannerComponent } from './setup-banner.component';

@NgModule({
  declarations: [SetupBannerComponent],
  exports: [SetupBannerComponent],
  imports: [
    SharedModule,
    SnackbarNotifModule,
    SetupEnumEditModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    ConfirmationDialogModule
  ]
})
export class SetupBannerModule { }