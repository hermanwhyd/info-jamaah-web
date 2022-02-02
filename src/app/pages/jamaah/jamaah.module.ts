import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollbarModule } from '../../../@vex/components/scrollbar/scrollbar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ContainerModule } from '../../../@vex/directives/container/container.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { DataTableComponent } from './data-table/data-table.component';
import { TableMenuComponent } from './table-menu/table-menu.component';
import { JamaahComponent } from './jamaah.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: JamaahComponent,
  },
  {
    path: 'form',
    loadChildren: () => import('./jamaah-edit/jamaah-edit.module').then(m => m.JamaahEditModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./jamaah-detail/jamaah-detail.module').then(m => m.JamaahDetailModule)
  }
];

@NgModule({
  declarations: [JamaahComponent, TableMenuComponent, DataTableComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatDialogModule,
    ScrollbarModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    SnackBarNotifModule
  ]
})
export class JamaahModule { }
