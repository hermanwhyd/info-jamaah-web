import { NgModule } from '@angular/core';
import { DashboardEvaluationComponent } from './dashboard-evaluation.component';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { SharedModule } from 'src/app/common/shared.module';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { VexModule } from 'src/@vex/vex.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

const routes: VexRoutes = [{path: '', component: DashboardEvaluationComponent}];

@NgModule({
  declarations: [DashboardEvaluationComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    PageLayoutModule,
    VexModule,
    SecondaryToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class DashboardEvaluationModule { }
