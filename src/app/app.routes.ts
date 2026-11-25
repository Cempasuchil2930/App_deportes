import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { RegistroJugadora } from './pages/registro-jugadora/registro-jugadora';
import { RegistroEquipo } from './pages/registro-equipo/registro-equipo';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro-jugadora', component: RegistroJugadora },
  { path: 'registro-equipo', component: RegistroEquipo },
  { path: 'recuperar-password', component: RecuperarPassword },
  { path: 'home', component: Home },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];