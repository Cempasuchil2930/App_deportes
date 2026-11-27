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
        <!-- Backdrop oscuro para móvil cuando el menú está abierto -->
        @if (mobileMenuOpen()) {
          <div
            (click)="mobileMenuOpen.set(false)"
            class="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          ></div>
        }

        <!-- Sidebar: fijo en escritorio, deslizable (drawer) en móvil -->
        <div
          [class]="mobileMenuOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
          class="fixed inset-y-0 left-0 z-50 md:static transition-transform duration-300 ease-in-out flex"
        >
          <app-sidebar [currentRole]="currentRole()" (roleChange)="cambiarRolManual($event)">
          </app-sidebar>
        </div>

        <div class="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] dark:bg-[#0B0D10]">
          <app-topbar
            [currentRole]="currentRole()"
            [pageTitle]="pageTitle()"
            (toggleMobileMenu)="mobileMenuOpen.set(!mobileMenuOpen())"
          ></app-topbar>

          <main class="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
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
  mobileMenuOpen = signal<boolean>(false);
  pageTitle = signal<string>('Inicio & Comunidad');

  ngOnInit() {
    this.leerSesion();
    this.verificarRuta(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.leerSesion();
        this.verificarRuta(event.urlAfterRedirects);
        this.mobileMenuOpen.set(false);
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

    if (url.startsWith('/torneo')) this.pageTitle.set('Torneo y Tablas');
    else if (url.startsWith('/entrenamientos')) this.pageTitle.set('Entrenamientos');
    else if (url.startsWith('/jugadora')) this.pageTitle.set('Perfil Jugadora');
    else if (url.startsWith('/admin')) this.pageTitle.set('Panel Admin & Cédula');
    else this.pageTitle.set('Inicio & Comunidad');
  }

  cambiarRolManual(nuevoRol: string) {
    this.currentRole.set(nuevoRol);
  }
}
