import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PembinaComponent } from './pembina.component';
import { RouterModule, Routes } from '@angular/router';
import { PembinaDetailComponent } from './pembina-detail/pembina-detail.component';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PembinaStatisticComponent } from './pembina-detail/pembina-statistic/pembina-statistic.component';
import { PembinaOverviewComponent } from './pembina-detail/pembina-overview/pembina-overview.component';
import { PembinaKepengurusanComponent } from './pembina-detail/pembina-kepengurusan/pembina-kepengurusan.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableFamilyModule } from 'src/app/shared/components/common/mat-table-family.module';
import { MatButtonFamilyModule } from 'src/app/shared/components/common/mat-button-family.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PengurusProfileComponent } from './shared/components/pengurus-profile/pengurus-profile.component';
import { AddPengurusDialogComponent } from './shared/components/add-pengurus-dialog/add-pengurus-dialog.component';
import { MatButtonLoadingModule } from 'src/app/shared/utilities/mat-button-loading/mat-button-loading.module';
import { MatDividerModule } from '@angular/material/divider';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

const routes: Routes = [
  {
    path: '',
    component: PembinaComponent,
  },
  {
    path: ':level/:pembina',
    component: PembinaDetailComponent,
    data: {
      toolbarShadowEnabled: true,
      containerEnabled: true
    },
    children: [
      {
        path: '',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: PembinaOverviewComponent
      },
      {
        path: 'statistic',
        component: PembinaStatisticComponent
      },
      {
        path: 'kepengurusan',
        component: PembinaKepengurusanComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    PembinaComponent,
    PembinaDetailComponent,
    PembinaStatisticComponent,
    PembinaOverviewComponent,
    PembinaKepengurusanComponent,
    PengurusProfileComponent,
    AddPengurusDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PageLayoutModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTableFamilyModule,
    MatButtonFamilyModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatButtonLoadingModule,
    MatDividerModule,
    NgxShimmerLoadingModule
  ]
})
export class PembinaModule { }
