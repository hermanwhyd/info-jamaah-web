import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetEditComponent } from './asset-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { IconModule } from '@visurel/iconify-angular';
import { BackButtonModule } from 'src/app/directives/back-button/back-button.module';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  { path: '', component: AssetEditComponent },
  { path: ':id', component: AssetEditComponent }
];

@NgModule({
  declarations: [
    AssetEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    IconModule,
    FlexLayoutModule,
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    SnackBarNotifModule,
    ContainerModule,
    SecondaryToolbarModule,
    BackButtonModule,
    MatExpansionModule,
  ]
})
export class AssetEditModule { }
