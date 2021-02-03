import { NgModule } from '@angular/core';

import { DashboardBankDiklatComponent } from './dashboard-bank-diklat.component';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { SharedModule } from 'src/app/common/shared.module';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoSelectedComponent } from './no-selected/no-selected.component';
import { WidgetQuickValueCenterModule } from '../../shared/widgets/widget-quick-value-center/widget-quick-value-center.module';
import { WidgetQuickChartModule } from '../../shared/widgets/widget-quick-chart/widget-quick-chart.module';

const routes: VexRoutes = [
  {
    path: '',
    component: DashboardBankDiklatComponent,
    children: [
      {path: '', component: NoSelectedComponent}
    ]
  },
];

@NgModule({
  declarations: [ DashboardBankDiklatComponent, NoSelectedComponent ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonFamilyModule,
    SecondaryToolbarModule,
    ContainerModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatMenuModule,
    NgApexchartsModule,
    MatProgressSpinnerModule,
    WidgetQuickValueCenterModule,
    WidgetQuickChartModule
  ]
})
export class DashboardBankDiklatModule { }
