import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetFileComponent } from './asset-file.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { MatTableFamilyModule } from 'src/app/common/mat-table-family.module';
import { SharedModule } from 'src/app/common/shared.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';
import { SnackBarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { AssetFileEditModule } from './asset-file-edit/asset-file-edit.module';

const routes: Routes = [
  { path: '', component: AssetFileComponent }
];

@NgModule({
  declarations: [AssetFileComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    MatTableFamilyModule,
    MatButtonFamilyModule,
    MatMenuModule,
    SnackBarNotifModule,
    ConfirmationDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    AssetFileEditModule
  ]
})
export class AssetFileModule { }
