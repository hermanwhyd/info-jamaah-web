import { NgModule } from '@angular/core';
import { CustomFieldEditorComponent } from './custom-field-editor.component';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { MatButtonFamilyModule } from 'src/app/shared/components/common/mat-button-family.module';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogModule } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.module';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { EditableModule } from '@ngneat/edit-in-place';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    CustomFieldEditorComponent
  ],
  imports: [
    SharedModule,
    MatButtonFamilyModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    ConfirmationDialogModule,
    SnackBarNotifModule,
    EditableModule,
    MatTooltipModule
  ],
  exports: [CustomFieldEditorComponent]
})
export class CustomFieldEditorModule { }
