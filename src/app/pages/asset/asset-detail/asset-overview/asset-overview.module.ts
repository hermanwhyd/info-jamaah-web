import { NgModule } from '@angular/core';
import { AssetOverviewComponent } from './asset-overview.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/common/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';


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
    NgxShimmerLoadingModule,
    GalleryModule,
    LightboxModule
  ]
})
export class AssetOverviewModule { }
