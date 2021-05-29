import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetNotificationComponent } from './asset-notification.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AssetNotificationComponent }
];

@NgModule({
  declarations: [
    AssetNotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AssetNotificationModule { }
