import { NgModule } from '@angular/core';
import { AssetOverviewComponent } from './asset-overview.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { QrCodeModule } from 'ng-qrcode';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { CustomFieldModule } from 'src/app/shared/pipes/custom-field/custom-field.module';

const routes: Routes = [
  { path: '', component: AssetOverviewComponent }
];

@NgModule({
  declarations: [AssetOverviewComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    QrCodeModule,
    NgxShimmerLoadingModule,
    GalleryModule,
    LightboxModule,
    CustomFieldModule,
  ]
})
export class AssetOverviewModule { }
