import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 1. Flujos de Acceso y Registro (Sin Sidebar ni Topbar)
  {
    path: 'login',
    data: { view: 'LOGIN' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then(m => m.AuthRegisterPageComponent)
  },
  {
    path: 'registro-jugadora',
    data: { view: 'REGISTER_PLAYER' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then(m => m.AuthRegisterPageComponent)
  },
  {
    path: 'registro-equipo',
    data: { view: 'REGISTER_TEAM' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then(m => m.AuthRegisterPageComponent)
  },
  {
    path: 'recuperar-password',
    data: { view: 'RECOVER' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then(m => m.AuthRegisterPageComponent)
  },

  // 2. Panel de Administración y Cédula Arbitral
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/auth-admin/admin-panel-page/admin-panel-page')
        .then(m => m.AdminPanelPageComponent)
  }
];