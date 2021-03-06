import { NgModule } from '@angular/core';
import { AssetComponent } from './asset.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ScrollbarModule } from 'src/@vex/components/scrollbar/scrollbar.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { DataTableComponent } from '../asset/data-table/data-table.component';
import { TableMenuComponent } from '../asset/table-menu/table-menu.component';
import { AssetCopyModule } from './asset-copy/asset-copy.module';

const routes: Routes = [
  {
    path: '',
    component: AssetComponent,
  },
  {
    path: 'form',
    loadChildren: () => import('./asset-edit/asset-edit.module').then(m => m.AssetEditModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./asset-detail/asset-detail.module').then(m => m.AssetDetailModule)
  }
];

@NgModule({
  declarations: [AssetComponent, TableMenuComponent, DataTableComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    ScrollbarModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    SnackBarNotifModule,
    AssetCopyModule
  ]
})
export class AssetModule { }
