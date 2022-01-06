import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBoxComponent } from './components/card-box/card-box.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonLoadingModule } from 'src/app/shared/utilities/mat-button-loading/mat-button-loading.module';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

@NgModule({
  declarations: [CardBoxComponent],
  imports: [
    CommonModule,
    MatIconModule,
    IconModule,
    FlexLayoutModule,
    MatButtonLoadingModule,
    NgxShimmerLoadingModule
  ],
  exports: [
    CardBoxComponent
  ]
})
export class JamaahSharedModule { }
