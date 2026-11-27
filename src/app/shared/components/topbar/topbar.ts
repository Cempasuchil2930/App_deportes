import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-30 bg-[#F8FAFC]/90 dark:bg-[#0B0D10]/90 backdrop-blur-md">
      <!-- Línea cromática sutil superior -->
      <div class="prism-hairline w-full"></div>

      <div
        class="px-4 md:px-6 py-3.5 flex items-center justify-between border-b border-slate-200/70 dark:border-[#232730]"
      >
        <div class="flex items-center gap-3 text-xs">
          <!-- Botón Hamburguesa (solo visible en móvil < 768px) -->
          <button
            type="button"
            (click)="toggleMobileMenu.emit()"
            aria-label="Abrir menú"
            class="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1B1F27] transition"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span class="font-bold text-slate-900 dark:text-white">{{ pageTitle }}</span>
          <span class="hidden sm:inline text-slate-400">/</span>
          <span class="hidden sm:inline text-slate-500 dark:text-slate-400"
            >4.ª Edición • Fútbol con orgullo y comunidad</span
          >
        </div>

        <div class="flex items-center gap-3">
          <span
            class="hidden lg:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            {{ roleLabel }}
          </span>

          @if (currentRole === 'PUBLIC') {
            <a
              routerLink="/login"
              class="btn-glow px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]"
            >
              Inscribirme
            </a>
          } @else {
            <a
              [routerLink]="currentRole === 'ADMIN' ? '/admin' : '/jugadora/20'"
              class="btn-glow px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              {{ currentRole === 'ADMIN' ? 'Panel Admin' : 'Mi Perfil' }}
            </a>
          }
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() pageTitle = 'Inicio & Comunidad';
  @Input() currentRole = 'PUBLIC';
  @Output() toggleMobileMenu = new EventEmitter<void>();

  get roleLabel(): string {
    const labels: Record<string, string> = {
      PUBLIC: 'Público / Patrocinador',
      PLAYER: 'Jugadora Registrada',
      CAPTAIN: 'Capitana / Manager',
      ADMIN: 'Admin General (Nayeli)',
    };
    return labels[this.currentRole] || 'Público / Patrocinador';
  }
}
