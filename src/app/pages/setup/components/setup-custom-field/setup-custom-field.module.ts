import { NgModule } from '@angular/core';
import { SetupCustomFieldComponent } from './setup-custom-field.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/common/shared.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { SnackBarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { SetupEnumEditModule } from '../setup-enum-edit/setup-enum-edit.module';

@NgModule({
  declarations: [
    SetupCustomFieldComponent
  ],
  imports: [
    SharedModule,
    SnackBarNotifModule,
    SetupEnumEditModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    ConfirmationDialogModule,
    MatExpansionModule
  ],
  exports: [SetupCustomFieldComponent]
})
export class SetupCustomFieldModule { }
