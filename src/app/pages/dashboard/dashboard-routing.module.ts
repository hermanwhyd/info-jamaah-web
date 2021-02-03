import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'analisa-diklat',
    loadChildren: () => import('./dashboard-bank-diklat/dashboard-bank-diklat.module').then(m => m.DashboardBankDiklatModule)
  },
  {
    path: 'evaluasi-diklat',
    loadChildren: () => import('./dashboard-evaluation/dashboard-evaluation.module').then(m => m.DashboardEvaluationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
