import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JamaahKepengurusanComponent } from './jamaah-kepengurusan.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { JamaahSharedModule } from '../../shared/jamaah-shared.module';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonFamilyModule } from 'src/app/shared/components/common/mat-button-family.module';
import { MatTableFamilyModule } from 'src/app/shared/components/common/mat-table-family.module';
import { MatButtonLoadingModule } from 'src/app/shared/utilities/mat-button-loading/mat-button-loading.module';
import { AddPengurusDialogComponent } from './add-pengurus-dialog/add-pengurus-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

const routes: Routes = [
  {
    path: '',
    component: JamaahKepengurusanComponent
  }
]

@NgModule({
  declarations: [
    JamaahKepengurusanComponent,
    AddPengurusDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    JamaahSharedModule,
    SharedModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTableFamilyModule,
    MatButtonFamilyModule,
    MatProgressSpinnerModule,
    MatButtonLoadingModule,
    MatDividerModule,
    NgxShimmerLoadingModule
  ]
})
export class JamaahKepengurusanModule { }
