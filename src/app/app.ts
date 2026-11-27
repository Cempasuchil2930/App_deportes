import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { TopbarComponent } from './shared/components/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    @if (isAuthRoute()) {
      <router-outlet></router-outlet>
    } @else {
      <div
        class="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B0D10] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300"
      >
        <app-sidebar [currentRole]="currentRole()" (roleChange)="cambiarRolManual($event)">
        </app-sidebar>

        <div class="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] dark:bg-[#0B0D10]">
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

  currentRole = signal<string>('PUBLIC');
  isAuthRoute = signal<boolean>(false);

  ngOnInit() {
    this.leerSesion();
    this.verificarRuta(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.leerSesion();
        this.verificarRuta(event.urlAfterRedirects);
      });
  }

  private leerSesion() {
    const sesionRaw = localStorage.getItem('sesionActiva');
    if (sesionRaw) {
      try {
        const sesion = JSON.parse(sesionRaw);
        this.currentRole.set(sesion.rol || 'PLAYER');
      } catch {
        this.currentRole.set('PUBLIC');
      }
    }
  }

  private verificarRuta(url: string) {
    const rutasSinShell = [
      '/login',
      '/registro-jugadora',
      '/registro-equipo',
      '/recuperar-password',
    ];
    this.isAuthRoute.set(rutasSinShell.some((ruta) => url.startsWith(ruta)));
  }

  cambiarRolManual(nuevoRol: string) {
    this.currentRole.set(nuevoRol);
  }
}
