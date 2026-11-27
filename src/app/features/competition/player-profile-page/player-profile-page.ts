import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LigaDataService } from '../../../shared/services/liga-data';
import { RadarChartComponent } from '../../../shared/components/radar-chart/radar-chart';

@Component({
  selector: 'app-player-profile-page',
  standalone: true,
  imports: [CommonModule, RadarChartComponent],
  template: `
    <div class="space-y-5">
      <!-- 1. SELECTOR RÁPIDO SUPERIOR DE JUGADORAS -->
      <div
        class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-xs"
      >
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
          Explorar Ficha Técnica:
        </span>

        <div class="flex flex-wrap items-center gap-1.5">
          @for (p of ligaData.perfilesJugadoras; track p.id) {
            <button
              type="button"
              (click)="cambiarJugadora(p.id)"
              [class]="
                selectedPlayerId() === p.id
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                  : 'bg-slate-50 dark:bg-[#1B1F27] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2A2F3B] hover:border-slate-400'
              "
              class="px-3 py-1 rounded-full text-[11px] font-semibold transition border cursor-pointer"
            >
              {{ p.shortLabel }}
            </button>
          }
        </div>
      </div>

      <!-- 2. TARJETA PRINCIPAL DE JUGADORA ESTILO FOTMOB -->
      <div
        class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] overflow-hidden shadow-xs"
      >
        <div class="prism-hairline w-full"></div>

        <div class="p-5 sm:p-6 pb-0">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-5">
            <div class="flex items-center gap-4">
              @if (player().imageConsent) {
                <div
                  class="p-[2px] rounded-2xl shadow-sm bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-500 shrink-0"
                >
                  <div
                    class="w-16 h-16 rounded-[14px] bg-slate-900 flex flex-col items-center justify-center text-white"
                  >
                    <span class="text-lg font-extrabold tracking-tight">
                      {{ player().initials }}
                    </span>
                    <span class="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
                      FOTO OK
                    </span>
                  </div>
                </div>
              } @else {
                <div
                  class="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex flex-col items-center justify-center text-purple-700 dark:text-purple-300 shrink-0"
                >
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="text-[9px] font-bold uppercase tracking-wider mt-0.5">AVATAR</span>
                </div>
              }

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

                  @if (player().imageConsent) {
                    <span
                      class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 ml-1"
                    >
                      ✓ Imagen pública autorizada
                    </span>
                  } @else {
                    <span
                      class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20"
                    >
                      Avatar protegido por privacidad
                    </span>
                  }
                </div>
              </div>
            </div>

            <button
              type="button"
              (click)="toggleSeguir()"
              [class]="
                isFollowing()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              "
              class="btn-glow px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>{{ isFollowing() ? '✓' : '+' }}</span>
              <span>{{ isFollowing() ? 'Siguiendo' : 'Seguir Jugadora' }}</span>
            </button>
          </div>

          <div class="flex items-center gap-6 border-t border-slate-100 dark:border-[#1F232D] pt-1 overflow-x-auto">
            <button
              type="button"
              (click)="activeTab.set('perfil')"
              [class]="
                activeTab() === 'perfil'
                  ? 'font-bold text-slate-900 dark:text-white border-purple-600'
                  : 'font-medium text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
              "
              class="py-3 text-xs border-b-2 transition cursor-pointer shrink-0"
            >
              Perfil
            </button>
            <button
              type="button"
              (click)="activeTab.set('partidos')"
              [class]="
                activeTab() === 'partidos'
                  ? 'font-bold text-slate-900 dark:text-white border-purple-600'
                  : 'font-medium text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
              "
              class="py-3 text-xs border-b-2 transition cursor-pointer shrink-0"
            >
              Partidos
            </button>
            <button
              type="button"
              (click)="activeTab.set('estadisticas')"
              [class]="
                activeTab() === 'estadisticas'
                  ? 'font-bold text-slate-900 dark:text-white border-purple-600'
                  : 'font-medium text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
              "
              class="py-3 text-xs border-b-2 transition cursor-pointer shrink-0"
            >
              Estadísticas
            </button>
            <button
              type="button"
              (click)="activeTab.set('trayectoria')"
              [class]="
                activeTab() === 'trayectoria'
                  ? 'font-bold text-slate-900 dark:text-white border-purple-600'
                  : 'font-medium text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
              "
              class="py-3 text-xs border-b-2 transition cursor-pointer shrink-0"
            >
              Trayectoria
            </button>
          </div>
        </div>
      </div>

      <!-- 3. CONTENIDO DINÁMICO POR PESTAÑA -->
      @if (activeTab() === 'perfil') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div class="lg:col-span-7 flex flex-col justify-between gap-5">
            <div
              class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs"
            >
              <h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5">
                DATOS FÍSICOS
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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

          <div
            class="lg:col-span-5 bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs flex flex-col justify-between"
          >
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                RADAR DE ATRIBUTOS
              </h2>
              <span class="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                6 Métricas
              </span>
            </div>
            <div class="my-auto">
              <app-radar-chart
                [stats]="player().radar"
                [accentColor]="player().accentColor"
              ></app-radar-chart>
            </div>
          </div>
        </div>
      }

      @if (activeTab() === 'partidos') {
        <div
          class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs space-y-3"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              Últimos Encuentros (40 min • 4.ª Edición)
            </h2>
            <span class="text-[11px] text-slate-400">Cédula Arbitral Oficial</span>
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
                    ★ MVP
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
      }

      @if (activeTab() === 'estadisticas') {
        <div
          class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs space-y-4"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              Desglose Técnico Detallado (4.ª Edición)
            </h2>
            <span class="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              Evaluación Coach Nayeli
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (stat of radarEntries(); track stat.label) {
              <div
                class="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1E26] border border-slate-100 dark:border-[#252A35]"
              >
                <div class="flex items-center justify-between text-xs font-bold mb-2">
                  <span class="text-slate-700 dark:text-slate-200">{{ stat.label }}</span>
                  <span class="text-purple-600 dark:text-purple-400">{{ stat.value }} / 100</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-[#282D39] overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    [style.width.%]="stat.value"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (activeTab() === 'trayectoria') {
        <div
          class="bg-white dark:bg-[#14171C] rounded-2xl border border-slate-200 dark:border-[#232730] p-5 shadow-xs space-y-3"
        >
          <h2 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            Historial en Liga de Fútbol Mujeres Diversas México
          </h2>

          @for (item of player().career; track $index) {
            <div
              class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1A1E26] border border-slate-100 dark:border-[#252A35]"
            >
              <div>
                <div class="text-xs font-extrabold text-slate-900 dark:text-white">
                  {{ item.edition }} •
                  <span class="text-purple-600 dark:text-purple-400">{{ item.team }}</span>
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ item.pj }} partidos jugados • {{ item.stat }}
                </div>
              </div>

              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              >
                {{ item.badge }}
              </span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PlayerProfilePageComponent implements OnInit {
  readonly ligaData = inject(LigaDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedPlayerId = signal<number>(1);
  activeTab = signal<'perfil' | 'partidos' | 'estadisticas' | 'trayectoria'>('perfil');
  followedIds = signal<number[]>([20]);

  readonly player = computed(
    () =>
      this.ligaData.perfilesJugadoras.find((p) => p.id === this.selectedPlayerId()) ??
      this.ligaData.perfilesJugadoras[0],
  );

  readonly isFollowing = computed(() => this.followedIds().includes(this.selectedPlayerId()));

  readonly radarEntries = computed(() => {
    const r = this.player().radar;
    return [
      { label: 'Ataque', value: r.Ataque },
      { label: 'Físico', value: r.Fisico },
      { label: 'Velocidad', value: r.Velocidad },
      { label: 'Pase', value: r.Pase },
      { label: 'Regate', value: r.Regate },
      { label: 'Defensa', value: r.Defensa },
    ];
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = Number(params.get('id'));
      if (idParam && this.ligaData.perfilesJugadoras.some((p) => p.id === idParam)) {
        this.selectedPlayerId.set(idParam);
      }
    });
  }

  cambiarJugadora(id: number) {
    this.selectedPlayerId.set(id);
    this.activeTab.set('perfil');
    this.router.navigate(['/jugadora', id]);
  }

  toggleSeguir() {
    const id = this.selectedPlayerId();
    this.followedIds.update((list) =>
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    );
  }
}