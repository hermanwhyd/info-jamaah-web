import { NgModule } from '@angular/core';
import { JamaahProfileComponent } from './jamaah-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { JamaahSharedModule } from '../../shared/jamaah-shared.module';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MatMenuModule } from '@angular/material/menu';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { JamaahUploadComponent } from './jamaah-upload/jamaah-upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

const routes: Routes = [
  { path: '', component: JamaahProfileComponent }
];

@NgModule({
  declarations: [
    JamaahProfileComponent,
    JamaahUploadComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    JamaahSharedModule,
    NgxShimmerLoadingModule,
    MatMenuModule,
    FilePickerModule,
    MatDialogModule,
    MatDividerModule
  ]
})
export class JamaahProfileModule { }
