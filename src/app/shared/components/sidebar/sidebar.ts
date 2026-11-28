import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Lee directamente el Signal de AuthService en tiempo real
  currentRole = this.authService.currentRole;

  collapsed = signal(false);
  isDark = signal(document.documentElement.classList.contains('dark'));

  roleInfo = computed(() => {
    const role = this.currentRole();
    const map: Record<UserRole, { label: string; tag: string; badgeClass: string }> = {
      PUBLIC: {
        label: 'Visitante Invitada',
        tag: 'Invitada',
        badgeClass: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      },
      CAPTAIN: {
        label: 'Equipo Oficial',
        tag: 'Equipo',
        badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
      },
      ADMIN: {
        label: 'Administración',
        tag: 'Admin',
        badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      },
    };
    return map[role] ?? map.PUBLIC;
  });

  toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    this.isDark.set(html.classList.contains('dark'));
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
