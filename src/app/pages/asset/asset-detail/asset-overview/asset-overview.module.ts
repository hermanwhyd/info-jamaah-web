import { NgModule } from '@angular/core';
import { AssetOverviewComponent } from './asset-overview.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/common/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  { path: '', component: AssetOverviewComponent }
];

@NgModule({
  declarations: [AssetOverviewComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    QRCodeModule,
    NgImageSliderModule,
    MatProgressSpinnerModule
  ]
})
export class AssetOverviewModule { }