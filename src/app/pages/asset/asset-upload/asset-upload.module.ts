import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetUploadComponent } from './asset-upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [AssetUploadComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonFamilyModule,
    MatIconModule,
    IconModule,
    FilePickerModule,
    FlexLayoutModule
  ]
})
export class AssetUploadModule { }
