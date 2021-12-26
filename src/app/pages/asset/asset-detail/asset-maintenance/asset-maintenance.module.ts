import { NgModule } from '@angular/core';
import { AssetMaintenanceComponent } from './asset-maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { MatButtonFamilyModule } from 'src/app/shared/components/common/mat-button-family.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { ConfirmationDialogModule } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.module';
import { MatTableFamilyModule } from 'src/app/shared/components/common/mat-table-family.module';
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
    SnackBarNotifModule,
    ConfirmationDialogModule,
    MatProgressSpinnerModule,
    AssetMaintenanceEditModule,
    MatCheckboxModule
  ]
})
export class AssetMaintenanceModule { }
