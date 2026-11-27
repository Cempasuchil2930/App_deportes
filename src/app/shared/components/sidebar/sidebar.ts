import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
      class="h-screen sticky top-0 bg-white dark:bg-[#14171C] border-r border-slate-200 dark:border-[#232730] flex flex-col justify-between transition-all duration-300 z-40 select-none"
    >
      <!-- Parte Superior: Logo + Botón Colapsar + Selector de Rol -->
      <div class="p-4">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3 overflow-hidden">
            <div
              class="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-amber-400 to-purple-500 shrink-0"
            >
              <div
                class="w-full h-full rounded-full bg-white dark:bg-[#14171C] flex items-center justify-center font-bold text-xs"
              >
                MD
              </div>
            </div>
            @if (!isCollapsed()) {
              <div class="leading-tight whitespace-nowrap">
                <p class="font-bold text-sm tracking-tight">Mujeres Diversas</p>
                <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  4.ª Edición • CDMX
                </p>
              </div>
            }
          </div>

          <button
            (click)="toggleCollapse()"
            class="w-7 h-7 rounded-lg border border-slate-200 dark:border-[#232730] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E222B] transition"
          >
            {{ isCollapsed() ? '›' : '‹' }}
          </button>
        </div>

        <!-- Selector Rápido de Rol -->
        @if (!isCollapsed()) {
          <div class="mb-6">
            <label
              class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5"
              >Rol Simulado</label
            >
            <select
              [value]="currentRole"
              (change)="onRoleChange($event)"
              class="w-full text-xs font-medium bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730] rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="PUBLIC">Público / Patrocinador</option>
              <option value="PLAYER">Jugadora Registrada</option>
              <option value="CAPTAIN">Capitana / Manager</option>
              <option value="ADMIN">Admin General (Nayeli)</option>
            </select>
          </div>
        } @else {
          <div class="mb-6 flex justify-center" [title]="'Rol: ' + currentRole">
            <span
              class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center justify-center"
            >
              {{ currentRole[0] }}
            </span>
          </div>
        }

        <!-- Menú de Navegación -->
        <nav class="space-y-1.5">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-slate-100 dark:bg-[#1E222B] font-semibold text-slate-900 dark:text-white"
              class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1E26] transition"
            >
              <!-- Indicador activo lateral -->
              <span class="text-base shrink-0">{{ item.icon }}</span>

              @if (!isCollapsed()) {
                <span class="truncate">{{ item.label }}</span>
              } @else {
                <!-- Tooltip flotante cuando el sidebar está colapsado -->
                <span
                  class="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity fixed left-20 bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50"
                >
                  {{ item.label }}
                </span>
              }
            </a>
          }
        </nav>
      </div>

      <!-- Parte Inferior: Modo Claro / Oscuro -->
      <div class="p-4 border-t border-slate-200 dark:border-[#232730]">
        <button
          (click)="toggleTheme()"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 dark:border-[#232730] hover:bg-slate-50 dark:hover:bg-[#1A1E26] transition text-xs font-medium"
        >
          <span class="flex items-center gap-2">
            <span>{{ isDark() ? '🌙' : '☀️' }}</span>
            @if (!isCollapsed()) {
              <span>{{ isDark() ? 'Modo Oscuro' : 'Modo Claro' }}</span>
            }
          </span>
          @if (!isCollapsed()) {
            <span
              class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0B0D10] text-slate-500"
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
  @Input() currentRole = 'PUBLIC';
  @Output() roleChange = new EventEmitter<string>();

  isCollapsed = signal(false);
  isDark = signal(false);

  navItems = [
    { label: 'Inicio', route: '/home', icon: '🏠' },
    { label: 'Torneo y Tablas', route: '/torneo', icon: '🏆' },
    { label: 'Perfil Jugadora', route: '/jugadora/1', icon: '👤' },
    { label: 'Entrenamientos', route: '/entrenamientos', icon: '⚡' },
    { label: 'Acceso y Registro', route: '/login', icon: '🔒' },
    { label: 'Panel Admin & Cédula', route: '/admin', icon: '📝' },
  ];

  toggleCollapse() {
    this.isCollapsed.update((v) => !v);
  }

  toggleTheme() {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.isDark());
  }

  onRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.roleChange.emit(select.value);
  }
}
