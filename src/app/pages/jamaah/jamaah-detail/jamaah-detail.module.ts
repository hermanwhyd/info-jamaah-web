import { NgModule } from '@angular/core';
import { JamaahDetailComponent } from './jamaah-detail.component';
import { SharedModule } from 'src/app/shared/components/common/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  {
    path: '',
    component: JamaahDetailComponent,
    data: {
      toolbarShadowEnabled: true,
      containerEnabled: true
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./jamaah-profile/jamaah-profile.module').then(m => m.JamaahProfileModule)
      }
    ]
  }
];

@NgModule({
  declarations: [JamaahDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    PageLayoutModule,
    MatTabsModule,
    MatMenuModule
  ]
})
export class JamaahDetailModule { }
