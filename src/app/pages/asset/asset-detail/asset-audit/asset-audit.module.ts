import { NgModule } from '@angular/core';
import { AssetAuditComponent } from './asset-audit.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { MatTableFamilyModule } from 'src/app/common/mat-table-family.module';
import { SharedModule } from 'src/app/common/shared.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';
import { SnackbarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { AssetAuditEditModule } from './asset-audit-edit/asset-audit-edit.module';

const routes: Routes = [
  { path: '', component: AssetAuditComponent }
];

@NgModule({
  declarations: [AssetAuditComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    MatTableFamilyModule,
    MatButtonFamilyModule,
    MatMenuModule,
    SnackbarNotifModule,
    ConfirmationDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    AssetAuditEditModule
  ]
})
export class AssetAuditModule { }