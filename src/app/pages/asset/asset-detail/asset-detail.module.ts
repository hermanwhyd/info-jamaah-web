import { NgModule } from '@angular/core';
import { AssetDetailComponent } from './asset-detail.component';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { ConfirmationDialogModule } from 'src/app/shared/utilities/confirmation-dialog/confirmation-dialog.module';
import { AssetCopyModule } from '../asset-copy/asset-copy.module';

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
      },
      {
        path: 'notifications',
        loadChildren: () => import('./asset-notification/asset-notification.module').then(m => m.AssetNotificationModule)
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
    SnackBarNotifModule,
    ConfirmationDialogModule,
    AssetCopyModule
  ]
})
export class AssetDetailModule { }
