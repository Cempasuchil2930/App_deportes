import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LigaDataService } from '../../../shared/services/liga-data';

@Component({
  selector: 'app-player-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-5">
      <!-- 1. BARRA SUPERIOR DE NAVEGACIÓN -->
      <div
        class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] px-4 py-3 flex items-center justify-between shadow-xs"
      >
        <button
          type="button"
          (click)="volverAEquipos()"
          class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
        >
          ← Volver a Equipos
        </button>

        <span class="text-[11px] font-semibold text-slate-400">
          Ficha Técnica • 4.ª Edición
        </span>
      </div>

      <!-- 2. TARJETA PRINCIPAL DE JUGADORA -->
      <div
        class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] overflow-hidden shadow-xs"
      >
        <div class="prism-hairline w-full"></div>

        <div class="p-5 sm:p-6">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Espacio reservado para foto de la jugadora -->
            <div
              class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#1A1E26] border border-slate-200 dark:border-[#2A2F3B] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 overflow-hidden"
            >
              <span class="text-lg font-extrabold tracking-tight">
                {{ player().initials }}
              </span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {{ player().fullName }}
                </h1>
                <span
                  class="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold"
                >
                  #{{ player().dorsal }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ player().team }}
                </span>

                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25"
                >
                  {{ player().position }}
                </span>

                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25"
                >
                  {{ player().pronouns }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. PERFIL (DATOS FÍSICOS Y RENDIMIENTO 4.ª EDICIÓN) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs"
        >
          <h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5">
            DATOS FÍSICOS
          </h2>
          <div class="grid grid-cols-2 gap-2.5">
            <div
              class="bg-slate-50 dark:bg-[#1A1E26] rounded-xl p-3 border border-slate-100 dark:border-[#252A35]"
            >
              <div class="text-[10px] text-slate-400 font-medium">Estatura</div>
              <div class="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                {{ player().physical.height }}
              </div>
            </div>
            <div
              class="bg-slate-50 dark:bg-[#1A1E26] rounded-xl p-3 border border-slate-100 dark:border-[#252A35]"
            >
              <div class="text-[10px] text-slate-400 font-medium">Edad</div>
              <div class="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                {{ player().physical.age }}
              </div>
            </div>
            <div
              class="bg-slate-50 dark:bg-[#1A1E26] rounded-xl p-3 border border-slate-100 dark:border-[#252A35]"
            >
              <div class="text-[10px] text-slate-400 font-medium">Nacimiento</div>
              <div class="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                {{ player().physical.birth }}
              </div>
            </div>
            <div
              class="bg-slate-50 dark:bg-[#1A1E26] rounded-xl p-3 border border-slate-100 dark:border-[#252A35]"
            >
              <div class="text-[10px] text-slate-400 font-medium">Pie Preferido</div>
              <div class="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                {{ player().physical.foot }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs"
        >
          <h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5">
            RENDIMIENTO 4.ª EDICIÓN (PARTIDOS DE 40')
          </h2>
          <div class="grid grid-cols-2 gap-2.5">
            <div class="rounded-xl p-3.5 bg-emerald-500/10 border border-emerald-500/20">
              <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                Partidos / Min
              </div>
              <div class="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                {{ player().season4.matchesMinutes }}
              </div>
            </div>

            <div class="rounded-xl p-3.5 bg-rose-500/10 border border-rose-500/20">
              <div class="text-[10px] font-bold text-rose-600 dark:text-rose-400">Goles</div>
              <div class="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                {{ player().season4.goals }}
              </div>
            </div>

            <div class="rounded-xl p-3.5 bg-blue-500/10 border border-blue-500/20">
              <div class="text-[10px] font-bold text-blue-600 dark:text-blue-400">Atajadas</div>
              <div class="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                {{ player().season4.saves }}
              </div>
            </div>

            <div class="rounded-xl p-3.5 bg-amber-500/10 border border-amber-500/20">
              <div class="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Tarjetas
              </div>
              <div class="text-xs font-extrabold text-slate-900 dark:text-white mt-2">
                {{ player().season4.cards }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. ÚLTIMOS PARTIDOS -->
      <div
        class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs space-y-3"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            Últimos Partidos
          </h2>
          <span class="text-[11px] text-slate-400">40 min • 4.ª Edición</span>
        </div>

        @for (m of player().recentMatches; track $index) {
          <div
            class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1E26] border border-slate-100 dark:border-[#252A35]"
          >
            <div class="flex items-center gap-3">
              <span
                class="px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-extrabold"
              >
                {{ m.jornada }}
              </span>
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">{{ m.rival }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ m.highlight }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              @if (m.mvp) {
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25"
                >
                  MVP
                </span>
              }
              <span class="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                {{ m.score }}
              </span>
              <span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {{ m.mins }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PlayerProfilePageComponent implements OnInit {
  readonly ligaData = inject(LigaDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedPlayerId = signal<number>(301);

  readonly player = computed(() => this.ligaData.obtenerPerfilPorId(this.selectedPlayerId()));

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = Number(params.get('id'));
      if (idParam) {
        this.selectedPlayerId.set(idParam);
      }
    });
  }

  volverAEquipos() {
    this.router.navigate(['/equipos']);
  }
}