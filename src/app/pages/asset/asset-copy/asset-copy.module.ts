import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetCopyComponent } from './asset-copy.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IconModule } from '@visurel/iconify-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SnackBarNotifModule } from 'src/app/shared/utilities/snackbar-notif/snackbar-notif.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonLoadingModule } from 'src/app/shared/utilities/mat-button-loading/mat-button-loading.module';

@NgModule({
  declarations: [
    AssetCopyComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FlexLayoutModule,
    MatInputModule,
    MatDividerModule,
    IconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    SnackBarNotifModule,
    MatSnackBarModule,
    MatButtonLoadingModule
  ]
})
export class AssetCopyModule { }
