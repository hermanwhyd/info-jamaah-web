import { NgModule } from '@angular/core';
import { AssetMaintenanceComponent } from './asset-maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/common/shared.module';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';
import { MatTableFamilyModule } from 'src/app/common/mat-table-family.module';
import { AssetMaintenanceEditModule } from './asset-maintenance-edit/asset-maintenance-edit.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  { path: '', component: AssetMaintenanceComponent }
];

@NgModule({
  declarations: [AssetMaintenanceComponent],
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
    AssetMaintenanceEditModule,
    MatCheckboxModule
  ]
})
export class AssetMaintenanceModule { }
