import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { RegistroJugadora } from './pages/registro-jugadora/registro-jugadora';
import { RegistroEquipo } from './pages/registro-equipo/registro-equipo';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro-jugadora', component: RegistroJugadora },
  { path: 'registro-equipo', component: RegistroEquipo },
  { path: 'recuperar-password', component: RecuperarPassword },
  { path: 'home', component: Home },
  {
    path: 'entrenamientos',
    loadComponent: () =>
      import('./pages/entrenamientos/entrenamientos').then((m) => m.Entrenamientos),
  },
  // Rutas temporales mientras Dev 1 y Dev 2 suben sus páginas:
  { path: 'torneo', component: Home },
  { path: 'jugadora/:id', component: Home },
  { path: 'admin', component: Home },
  // Comodín siempre al final:
  { path: '**', redirectTo: 'home' },
];
