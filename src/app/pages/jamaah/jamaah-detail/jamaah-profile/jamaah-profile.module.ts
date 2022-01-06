import { NgModule } from '@angular/core';
import { JamaahProfileComponent } from './jamaah-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { JamaahSharedModule } from '../../shared/jamaah-shared.module';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

const routes: Routes = [
  { path: '', component: JamaahProfileComponent }
];

@NgModule({
  declarations: [JamaahProfileComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
    JamaahSharedModule,
    NgxShimmerLoadingModule
  ]
})
export class JamaahProfileModule { }
