import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      [class.w-64]="!collapsed()"
      [class.w-20]="collapsed()"
      class="h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200 dark:border-[#232730] bg-white dark:bg-[#14171C] transition-all duration-300 z-30"
    >
      <!-- Header / Escudo -->
      <div class="p-4">
        <div class="flex items-center justify-between">
          <a routerLink="/home" class="flex items-center gap-3 overflow-hidden">
            <div
              class="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-amber-400 to-purple-600 shrink-0"
            >
              <div
                class="w-full h-full rounded-full bg-white dark:bg-[#14171C] flex items-center justify-center font-extrabold text-xs text-slate-900 dark:text-white"
              >
                MD
              </div>
            </div>
            @if (!collapsed()) {
              <div class="truncate">
                <p class="font-bold text-sm leading-tight text-slate-900 dark:text-white">
                  Mujeres Diversas
                </p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">4.ª EDICIÓN • CDMX</p>
              </div>
            }
          </a>

          <button
            (click)="collapsed.set(!collapsed())"
            class="p-1.5 rounded-lg border border-slate-200 dark:border-[#232730] text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              @if (collapsed()) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              }
            </svg>
          </button>
        </div>

        <!-- Tarjeta informativa de Sesión Activa -->
        @if (!collapsed()) {
          <div
            class="mt-5 p-3 rounded-xl border border-slate-200/80 dark:border-[#232730] bg-slate-50/80 dark:bg-[#0B0D10]"
          >
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sesión Actual
            </p>
            <div class="mt-1 flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-slate-900 dark:text-white truncate">
                {{ roleInfo().label }}
              </span>
              <span
                [class]="roleInfo().badgeClass"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
              >
                {{ roleInfo().tag }}
              </span>
            </div>
          </div>
        }

        <!-- Navegación filtrada por Rol en tiempo real -->
        <nav class="mt-6 space-y-1">
          <!-- 1. Inicio (Todos: Invitada, Equipo y Admin) -->
          <a
            routerLink="/home"
            routerLinkActive="bg-slate-100 dark:bg-[#1F242D] text-slate-900 dark:text-white font-semibold"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1B1F27] hover:text-slate-900 dark:hover:text-white transition"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            @if (!collapsed()) {
              <span class="truncate">Inicio</span>
            }
          </a>

          <!-- 2. Torneo y Tablas (Todos: Invitada, Equipo y Admin) -->
          <a
            routerLink="/torneo"
            routerLinkActive="bg-slate-100 dark:bg-[#1F242D] text-slate-900 dark:text-white font-semibold"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1B1F27] hover:text-slate-900 dark:hover:text-white transition"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 21h8m-4-4v4m-5.5-9.5A5.5 5.5 0 0112 6a5.5 5.5 0 015.5 5.5c0 2.5-2 4.5-5.5 4.5s-5.5-2-5.5-4.5zM4 7h2.5M17.5 7H20"
              />
            </svg>
            @if (!collapsed()) {
              <span class="truncate">Torneo y Tablas</span>
            }
          </a>

          <!-- 3. Equipos (Todos: Invitada, Equipo y Admin) -->
          <a
            routerLink="/equipos"
            routerLinkActive="bg-slate-100 dark:bg-[#1F242D] text-slate-900 dark:text-white font-semibold"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1B1F27] hover:text-slate-900 dark:hover:text-white transition"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            @if (!collapsed()) {
              <span class="truncate">Equipos</span>
            }
          </a>

          <!-- 4. Entrenamientos (Solo Equipo y Admin; oculto a Invitada) -->
          @if (currentRole() !== 'PUBLIC') {
            <a
              routerLink="/entrenamientos"
              routerLinkActive="bg-slate-100 dark:bg-[#1F242D] text-slate-900 dark:text-white font-semibold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1B1F27] hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              @if (!collapsed()) {
                <span class="truncate">Entrenamientos</span>
              }
            </a>
          }

          <!-- 5. Panel Admin & Cédula (Exclusivo Administradora Nayeli) -->
          @if (currentRole() === 'ADMIN') {
            <a
              routerLink="/admin"
              routerLinkActive="bg-slate-100 dark:bg-[#1F242D] text-slate-900 dark:text-white font-semibold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1B1F27] hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              @if (!collapsed()) {
                <span class="truncate">Panel Admin & Cédula</span>
              }
            </a>
          }
        </nav>
      </div>

      <!-- Footer: Acción de Sesión + Modo Claro/Oscuro -->
      <div class="p-4 border-t border-slate-200 dark:border-[#232730] space-y-2">
        @if (currentRole() === 'PUBLIC') {
          <a
            routerLink="/login"
            class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            @if (!collapsed()) {
              <span>Iniciar Sesión</span>
            }
          </a>
        } @else {
          <button
            (click)="cerrarSesion()"
            class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition cursor-pointer"
          >
            <svg
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            @if (!collapsed()) {
              <span>Cerrar Sesión</span>
            }
          </button>
        }

        <button
          (click)="toggleTheme()"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#232730] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1B1F27] transition cursor-pointer"
        >
          <span class="flex items-center gap-2">
            <svg
              class="w-4 h-4 text-amber-500 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              @if (isDark()) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              }
            </svg>
            @if (!collapsed()) {
              <span>{{ isDark() ? 'Modo Oscuro' : 'Modo Claro' }}</span>
            }
          </span>
          @if (!collapsed()) {
            <span
              class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#232730] text-slate-600 dark:text-slate-300"
            >
              {{ isDark() ? 'ON' : 'OFF' }}
            </span>
          }
        </button>
      </div>
    </aside>
  `,
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