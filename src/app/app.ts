import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { TopbarComponent } from './shared/components/topbar/topbar';
import { FooterComponent } from './shared/components/footer/footer';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private router = inject(Router);
  readonly authService = inject(AuthService);

  isAuthRoute = signal<boolean>(false);
  isAdminRoute = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  pageTitle = signal<string>('Inicio & Comunidad');

  ngOnInit() {
    this.verificarRuta(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.verificarRuta(event.urlAfterRedirects);
        this.mobileMenuOpen.set(false);
      });
  }

  private verificarRuta(url: string) {
    const rutasSinShell = [
      '/login',
      '/registro-jugadora',
      '/registro-equipo',
      '/recuperar-password',
    ];
    this.isAuthRoute.set(rutasSinShell.some((ruta) => url.startsWith(ruta)));
    this.isAdminRoute.set(url.startsWith('/admin'));

    if (url.startsWith('/torneo')) this.pageTitle.set('Torneo y Tablas');
    else if (url.startsWith('/equipos')) this.pageTitle.set('Equipos y Plantillas');
    else if (url.startsWith('/entrenamientos')) this.pageTitle.set('Entrenamientos');
    else if (url.startsWith('/jugadora')) this.pageTitle.set('Perfil Jugadora');
    else if (url.startsWith('/admin')) this.pageTitle.set('Panel Admin & Cédula');
    else this.pageTitle.set('Inicio & Comunidad');
  }
}
