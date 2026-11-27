import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [

  
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  
  // ... aquí van las rutas de inicio / login de tu compañera si ya existen ...
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then(m => m.AuthRegisterPageComponent)
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/auth-admin/admin-panel-page/admin-panel-page')
        .then(m => m.AdminPanelPageComponent)
  }
];