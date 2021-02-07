import { NgModule } from '@angular/core';
import { JamaahProfileComponent } from './jamaah-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/common/shared.module';

const routes: Routes = [
  { path: '', component: JamaahProfileComponent }
];

@NgModule({
  declarations: [JamaahProfileComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule,
  ]
})
export class JamaahProfileModule { }
