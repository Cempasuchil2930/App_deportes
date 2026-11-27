import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { TopbarComponent } from './shared/components/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    @if (isAuthRoute()) {
      <router-outlet></router-outlet>
    } @else {
      <div class="min-h-screen flex">
        <app-sidebar [currentRole]="currentRole()" (roleChange)="cambiarRolManual($event)">
        </app-sidebar>

        <div class="flex-1 flex flex-col min-w-0">
          <app-topbar [currentRole]="currentRole()"></app-topbar>
          <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    }
  `,
})
export class App implements OnInit {
  private router = inject(Router);
  currentRole = signal('PUBLIC');

  ngOnInit() {
    this.cargarRolDesdeStorage();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.cargarRolDesdeStorage());
  }

  cargarRolDesdeStorage() {
    const raw = localStorage.getItem('sesionActiva');
    if (!raw) return;
    try {
      const sesion = JSON.parse(raw);
      const mapRoles: Record<string, string> = {
        admin: 'ADMIN',
        equipo: 'CAPTAIN',
        jugadora: 'PLAYER',
      };
      if (sesion.rol && mapRoles[sesion.rol]) {
        this.currentRole.set(mapRoles[sesion.rol]);
      }
    } catch {}
  }

  cambiarRolManual(nuevoRol: string) {
    this.currentRole.set(nuevoRol);
  }

  isAuthRoute(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/registro') || url.includes('/recuperar');
  }
}
