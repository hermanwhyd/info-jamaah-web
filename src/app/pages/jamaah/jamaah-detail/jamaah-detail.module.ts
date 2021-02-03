import { NgModule } from '@angular/core';
import { JamaahDetailComponent } from './jamaah-detail.component';
import { SharedModule } from 'src/app/common/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  { path: '', component: JamaahDetailComponent }
];

@NgModule({
  declarations: [JamaahDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    PageLayoutModule,
    IconModule,
    FlexLayoutModule,
    MatTooltipModule
  ]
})
export class JamaahDetailModule { }
