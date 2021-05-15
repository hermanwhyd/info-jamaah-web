import { NgModule } from '@angular/core';
import { AssetDetailComponent } from './asset-detail.component';
import { SharedModule } from 'src/app/common/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { ConfirmationDialogModule } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: AssetDetailComponent,
    data: {
      toolbarShadowEnabled: true,
      containerEnabled: true
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./asset-overview/asset-overview.module').then(m => m.AssetOverviewModule)
      },
      {
        path: 'maintenances',
        loadChildren: () => import('./asset-maintenance/asset-maintenance.module').then(m => m.AssetMaintenanceModule)
      },
      {
        path: 'audits',
        loadChildren: () => import('./asset-audit/asset-audit.module').then(m => m.AssetAuditModule)
      },
      {
        path: 'files',
        loadChildren: () => import('./asset-file/asset-file.module').then(m => m.AssetFileModule)
      }
    ]
  }
];

@NgModule({
  declarations: [AssetDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    PageLayoutModule,
    MatTabsModule,
    MatDialogModule,
    FilePickerModule,
    MatMenuModule,
    SnackbarNotifModule,
    ConfirmationDialogModule,
  ]
})
export class AssetDetailModule { }
