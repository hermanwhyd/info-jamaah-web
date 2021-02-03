import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuard } from './auth/guard/auth.guard';
import { MainGuard } from './auth/guard/main.guard';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

const routes: VexRoutes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/access/login/loging.module').then(m => m.LoginModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/access/logout/logout.module').then(m => m.LogoutModule),
    canActivate: [MainGuard]
  },
  {
    path: '',
    component: CustomLayoutComponent,
    canActivateChild: [MainGuard],
    canLoad: [MainGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'jamaah',
        loadChildren: () => import('./pages/jamaah/jamaah.module').then(m => m.JamaahModule),
        data: ['ADMIN']
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
        data: ['ADMIN']
      },
      {
        path: 'setup',
        loadChildren: () => import('./pages/setup/setup.module').then(m => m.SetupModule),
        data: ['ADMIN']
      },
      {
        path: 'no-access',
        loadChildren: () => import('./pages/access/error-403/error-403.module').then(m => m.Error403Module)
      },
      {
        path: '**',
        loadChildren: () => import('./pages/access/maintenance/maintenance.module').then(m => m.MaintenanceModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
