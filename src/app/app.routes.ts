import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  
  {
    path: 'login',
    data: { view: 'LOGIN' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page').then(
        (m) => m.AuthRegisterPageComponent,
      ),
  },
  {
    path: 'registro-equipo',
    data: { view: 'REGISTER_TEAM' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page').then(
        (m) => m.AuthRegisterPageComponent,
      ),
  },
  {
    path: 'recuperar-password',
    data: { view: 'RECOVER' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page').then(
        (m) => m.AuthRegisterPageComponent,
      ),
  },

 
  { path: 'home', component: Home },
  {
    path: 'entrenamientos',
    canActivate: [roleGuard],
    data: { roles: ['CAPTAIN', 'ADMIN'] },
    loadComponent: () =>
      import('./pages/entrenamientos/entrenamientos').then((m) => m.Entrenamientos),
  },

  
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/auth-admin/admin-panel-page/admin-panel-page').then(
        (m) => m.AdminPanelPageComponent,
      ),
  },

  {
    path: 'torneo',
    loadComponent: () =>
      import('./features/competition/tournament-page/tournament-page').then(
        (m) => m.TournamentPageComponent,
      ),
  },
  {
    path: 'equipos',
    loadComponent: () =>
      import('./features/competition/teams-page/teams-page').then(
        (m) => m.TeamsPageComponent,
      ),
  },
  {
    path: 'jugadora/:id',
    loadComponent: () =>
      import('./features/competition/player-profile-page/player-profile-page').then(
        (m) => m.PlayerProfilePageComponent,
      ),
  },


  { path: '**', redirectTo: 'login' },
];