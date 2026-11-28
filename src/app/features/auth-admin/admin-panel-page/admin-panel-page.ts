import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesEquiposService } from '../../../shared/services/solicitudes-equipos';
import { LigaDataService } from '../../../shared/services/liga-data';

type AdminTab = 'PANEL' | 'CEDULA';

interface PlayerEventRow {
  dorsal: number;
  name: string;
  position: string;
  minutes: number;
  goals: number;
  assists: number;
  saves: number;
  yellowCards: number;
  redCards: number;
}

interface SavedMatchSheet {
  id: number;
  matchday: string;
  cancha: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  decidedByPenalties: boolean;
  homePenalties: number;
  awayPenalties: number;
  homePlayers?: PlayerEventRow[];
  awayPlayers?: PlayerEventRow[];
  date: string;
}

@Component({
  selector: 'app-admin-panel-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './admin-panel-page.css',
  template: `
    <div
      class="min-h-screen bg-transparent text-[#111111] dark:text-slate-100 p-4 sm:p-8 transition-colors duration-300"
    >
      <div class="max-w-[1220px] mx-auto space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 px-1">
          <h1
            class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] dark:text-white"
          >
            {{ activeTab() === 'PANEL' ? 'Panel Administrativo' : 'Cédula Arbitral' }}
          </h1>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              (click)="activeTab.set('PANEL')"
              [ngClass]="
                activeTab() === 'PANEL'
                  ? 'bg-[#FCE7EB] text-[#8E3545] border-[#C57B87]/70'
                  : 'bg-white dark:bg-[#14171C] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#232730] hover:bg-slate-50'
              "
              class="px-5 py-2.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
            >
              Panel Administrativo
            </button>

            <button
              type="button"
              (click)="activeTab.set('CEDULA')"
              [ngClass]="
                activeTab() === 'CEDULA'
                  ? 'bg-[#E5EFFC] text-[#2B548C] border-[#7FA3D4]/70'
                  : 'bg-white dark:bg-[#14171C] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-[#232730] hover:bg-slate-50'
              "
              class="px-5 py-2.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
            >
              Cédula de Partido
            </button>
          </div>
        </div>

        <div
          *ngIf="feedbackMessage()"
          class="rounded-2xl px-4 py-3 bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#059669] flex items-center justify-between"
        >
          <span>✓ {{ feedbackMessage() }}</span>
          <button type="button" (click)="feedbackMessage.set('')" class="underline cursor-pointer">
            Cerrar
          </button>
        </div>

        <div *ngIf="activeTab() === 'PANEL'" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="admin-white-card rounded-3xl p-6 space-y-1.5">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Equipos Inscritos
              </p>
              <p class="text-3xl font-extrabold text-[#111111] dark:text-white">
                {{ approvedTeamsCount() }}
              </p>
            </div>

            <div class="admin-white-card rounded-3xl p-6 space-y-1.5">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Solicitudes por Revisar
              </p>
              <p class="text-3xl font-extrabold text-[#9F3A4B]">{{ pendingCount() }}</p>
            </div>

            <div class="admin-white-card rounded-3xl p-6 space-y-1.5">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Jornada Actual
              </p>
              <p class="text-3xl font-extrabold text-[#2E5B9A]">Jornada 9</p>
            </div>
          </div>

          <div class="admin-white-card rounded-3xl p-6 sm:p-7 space-y-5">
            <div class="pb-3 border-b border-slate-200/80 dark:border-[#232730]">
              <h2 class="text-base font-extrabold text-[#111111] dark:text-white">
                Solicitudes de Inscripción de Equipos
              </h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="border-b border-slate-200/80 dark:border-[#232730] text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    <th class="py-3 px-3">Equipo</th>
                    <th class="py-3 px-3">Color</th>
                    <th class="py-3 px-3">Capitana / Correo</th>
                    <th class="py-3 px-3">Estatus</th>
                    <th class="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-[#232730] text-xs">
                  <tr *ngFor="let req of solicitudesService.solicitudes()">
                    <td class="py-3.5 px-3 font-extrabold text-[#111111] dark:text-white">
                      {{ req.nombreEquipo }}
                    </td>
                    <td class="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {{ req.colorDistintivo }}
                    </td>
                    <td class="py-3.5 px-3">
                      <p class="font-bold text-[#111111] dark:text-white">{{ req.capitana }}</p>
                      <p class="text-[11px] text-slate-500">{{ req.correo }}</p>
                    </td>
                    <td class="py-3.5 px-3">
                      <span
                        [ngClass]="{
                          'bg-amber-50 text-amber-700 border-amber-200':
                            req.estatus === 'PENDIENTE',
                          'bg-emerald-50 text-emerald-700 border-emerald-200':
                            req.estatus === 'APROBADO',
                          'bg-rose-50 text-rose-700 border-rose-200': req.estatus === 'RECHAZADO',
                        }"
                        class="inline-flex px-3 py-1 rounded-full text-[11px] font-bold border"
                      >
                        {{ req.estatus }}
                      </span>
                    </td>
                    <td class="py-3.5 px-3 text-right space-x-2">
                      <button
                        type="button"
                        (click)="updateRequestStatus(req.id, 'APROBADO')"
                        class="px-3.5 py-1.5 rounded-full bg-[#ECFDF5] hover:bg-emerald-100 text-[#059669] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        (click)="updateRequestStatus(req.id, 'RECHAZADO')"
                        class="px-3.5 py-1.5 rounded-full bg-[#FFF1F2] hover:bg-rose-100 text-[#E11D48] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab() === 'CEDULA'" class="space-y-6">
          <div
            *ngIf="editingSheetId()"
            class="rounded-2xl px-4 py-3 bg-[#E5EFFC] border border-[#7FA3D4]/70 text-xs font-bold text-[#2B548C] flex items-center justify-between"
          >
            <span>
              ✎ Editando cédula guardada ({{ selectedMatchday }} · {{ homeTeam }} vs {{ awayTeam }})
            </span>
            <button type="button" (click)="cancelEditSheet()" class="underline cursor-pointer">
              Cancelar edición
            </button>
          </div>

          <div class="admin-white-card rounded-3xl p-6 sm:p-7 space-y-6">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-slate-200/80 dark:border-[#232730]"
            >
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jornada
                </label>
                <select
                  [(ngModel)]="selectedMatchday"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                >
                  <option value="Jornada 1">Jornada 1</option>
                  <option value="Jornada 2">Jornada 2</option>
                  <option value="Jornada 3">Jornada 3</option>
                  <option value="Jornada 4">Jornada 4</option>
                  <option value="Jornada 5">Jornada 5</option>
                  <option value="Jornada 6">Jornada 6</option>
                  <option value="Jornada 7">Jornada 7</option>
                  <option value="Jornada 8">Jornada 8</option>
                  <option value="Jornada 9">Jornada 9</option>
                  <option value="Jornada 10">Jornada 10</option>
                  <option value="Jornada 11">Jornada 11</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sede / Cancha
                </label>
                <select
                  [(ngModel)]="selectedCancha"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                >
                  <option value="Cancha 1">Cancha 1</option>
                  <option value="Cancha 2">Cancha 2</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Equipo Local
                </label>
                <select
                  [(ngModel)]="homeTeam"
                  (ngModelChange)="onTeamChange('HOME', $event)"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                >
                  <option *ngFor="let eq of ligaData.equipos()" [value]="eq.name">
                    {{ eq.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Equipo Visitante
                </label>
                <select
                  [(ngModel)]="awayTeam"
                  (ngModelChange)="onTeamChange('AWAY', $event)"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                >
                  <option *ngFor="let eq of ligaData.equipos()" [value]="eq.name">
                    {{ eq.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4 py-2">
              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-[#1A1E26] text-slate-500"
              >
                Tiempo Reglamentario • 40 Minutos (2 × 20')
              </span>

              <div class="flex items-center justify-center gap-8">
                <div class="text-center space-y-1">
                  <p class="text-xs font-extrabold text-slate-600 dark:text-slate-300">
                    {{ homeTeam }}
                  </p>
                  <p class="text-4xl font-black text-[#111111] dark:text-white">
                    {{ totalHomeGoals() }}
                  </p>
                </div>

                <span class="text-lg font-extrabold text-slate-400">VS</span>

                <div class="text-center space-y-1">
                  <p class="text-xs font-extrabold text-slate-600 dark:text-slate-300">
                    {{ awayTeam }}
                  </p>
                  <p class="text-4xl font-black text-[#111111] dark:text-white">
                    {{ totalAwayGoals() }}
                  </p>
                </div>
              </div>

              <!-- TANDA DE PENALES AUTOMÁTICA EN CASO DE EMPATE (REGLAMENTO SIN EMPATES) -->
              <div
                *ngIf="isDraw()"
                class="w-full max-w-md rounded-2xl p-4 bg-amber-50/90 dark:bg-amber-500/10 border border-amber-300/80 dark:border-amber-500/30 space-y-2.5"
              >
                <div class="flex items-center justify-between">
                  <span
                    class="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300"
                  >
                    Definición por Penales (Sin Empates)
                  </span>
                  <span class="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    Obligatorio
                  </span>
                </div>

                <div class="flex items-center justify-center gap-4">
                  <div class="text-center">
                    <label
                      class="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Penales {{ homeTeam }}
                    </label>
                    <input
                      type="number"
                      min="0"
                      [(ngModel)]="homePenalties"
                      class="w-16 text-center py-1.5 rounded-xl bg-white dark:bg-[#0B0D10] border border-amber-300 font-extrabold text-sm"
                    />
                  </div>

                  <span class="text-xs font-extrabold text-slate-400 mt-4">-</span>

                  <div class="text-center">
                    <label
                      class="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1"
                    >
                      Penales {{ awayTeam }}
                    </label>
                    <input
                      type="number"
                      min="0"
                      [(ngModel)]="awayPenalties"
                      class="w-16 text-center py-1.5 rounded-xl bg-white dark:bg-[#0B0D10] border border-amber-300 font-extrabold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div class="admin-white-card rounded-3xl p-5 sm:p-6 space-y-4">
              <div
                class="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-[#232730]"
              >
                <h2 class="text-sm font-extrabold text-[#111111] dark:text-white">
                  {{ homeTeam }} · Cédula Individual
                </h2>
                <span class="text-[11px] font-semibold text-slate-400">
                  {{ homePlayers().length }} jugadoras
                </span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left">
                  <thead>
                    <tr
                      class="text-[10px] text-slate-500 uppercase border-b border-slate-100 dark:border-[#232730]"
                    >
                      <th class="py-2 pr-1">#</th>
                      <th class="py-2 pr-2">Jugadora</th>
                      <th class="py-2 px-1 text-center" title="Minutos jugados (máx. 40)">MIN</th>
                      <th class="py-2 px-1 text-center">GOL</th>
                      <th class="py-2 px-1 text-center">ASIST</th>
                      <th class="py-2 px-1 text-center" title="Atajadas de portera">ATAJ</th>
                      <th class="py-2 px-1 text-center">TA</th>
                      <th class="py-2 pl-1 text-center">TR</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-[#232730]">
                    <tr *ngFor="let p of homePlayers()">
                      <td class="py-2 pr-1 font-bold text-slate-500">{{ p.dorsal }}</td>
                      <td class="py-2 pr-2">
                        <div
                          class="font-bold text-slate-900 dark:text-white truncate max-w-[130px]"
                        >
                          {{ p.name }}
                        </div>
                        <div class="text-[10px] text-slate-400">{{ p.position }}</div>
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="40"
                          [(ngModel)]="p.minutes"
                          class="w-11 text-center py-1 rounded-lg bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730] font-bold"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [(ngModel)]="p.goals"
                          class="w-10 text-center py-1 rounded-lg bg-rose-50/70 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 font-bold text-rose-700 dark:text-rose-300"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [(ngModel)]="p.assists"
                          class="w-10 text-center py-1 rounded-lg bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 font-bold text-emerald-700 dark:text-emerald-300"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [disabled]="p.position !== 'Portera'"
                          [(ngModel)]="p.saves"
                          class="w-10 text-center py-1 rounded-lg bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 font-bold text-blue-700 dark:text-blue-300 disabled:opacity-30"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="2"
                          [(ngModel)]="p.yellowCards"
                          class="w-10 text-center py-1 rounded-lg bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 font-bold text-amber-800 dark:text-amber-300"
                        />
                      </td>
                      <td class="py-2 pl-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="1"
                          [(ngModel)]="p.redCards"
                          class="w-10 text-center py-1 rounded-lg bg-rose-100/70 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 font-bold text-rose-800 dark:text-rose-300"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- EQUIPO VISITANTE -->
            <div class="admin-white-card rounded-3xl p-5 sm:p-6 space-y-4">
              <div
                class="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-[#232730]"
              >
                <h2 class="text-sm font-extrabold text-[#111111] dark:text-white">
                  {{ awayTeam }} · Cédula Individual
                </h2>
                <span class="text-[11px] font-semibold text-slate-400">
                  {{ awayPlayers().length }} jugadoras
                </span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left">
                  <thead>
                    <tr
                      class="text-[10px] text-slate-500 uppercase border-b border-slate-100 dark:border-[#232730]"
                    >
                      <th class="py-2 pr-1">#</th>
                      <th class="py-2 pr-2">Jugadora</th>
                      <th class="py-2 px-1 text-center" title="Minutos jugados (máx. 40)">MIN</th>
                      <th class="py-2 px-1 text-center">GOL</th>
                      <th class="py-2 px-1 text-center">ASIST</th>
                      <th class="py-2 px-1 text-center" title="Atajadas de portera">ATAJ</th>
                      <th class="py-2 px-1 text-center">TA</th>
                      <th class="py-2 pl-1 text-center">TR</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-[#232730]">
                    <tr *ngFor="let p of awayPlayers()">
                      <td class="py-2 pr-1 font-bold text-slate-500">{{ p.dorsal }}</td>
                      <td class="py-2 pr-2">
                        <div
                          class="font-bold text-slate-900 dark:text-white truncate max-w-[130px]"
                        >
                          {{ p.name }}
                        </div>
                        <div class="text-[10px] text-slate-400">{{ p.position }}</div>
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="40"
                          [(ngModel)]="p.minutes"
                          class="w-11 text-center py-1 rounded-lg bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730] font-bold"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [(ngModel)]="p.goals"
                          class="w-10 text-center py-1 rounded-lg bg-rose-50/70 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 font-bold text-rose-700 dark:text-rose-300"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [(ngModel)]="p.assists"
                          class="w-10 text-center py-1 rounded-lg bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 font-bold text-emerald-700 dark:text-emerald-300"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          [disabled]="p.position !== 'Portera'"
                          [(ngModel)]="p.saves"
                          class="w-10 text-center py-1 rounded-lg bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 font-bold text-blue-700 dark:text-blue-300 disabled:opacity-30"
                        />
                      </td>
                      <td class="py-2 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="2"
                          [(ngModel)]="p.yellowCards"
                          class="w-10 text-center py-1 rounded-lg bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 font-bold text-amber-800 dark:text-amber-300"
                        />
                      </td>
                      <td class="py-2 pl-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="1"
                          [(ngModel)]="p.redCards"
                          class="w-10 text-center py-1 rounded-lg bg-rose-100/70 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 font-bold text-rose-800 dark:text-rose-300"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              *ngIf="editingSheetId()"
              type="button"
              (click)="cancelEditSheet()"
              class="px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              (click)="saveMatchSheet()"
              class="px-7 py-3 rounded-full bg-[#FCE7EB] hover:bg-[#F9D5DC] text-[#8E3545] border border-[#C57B87]/60 text-xs font-extrabold tracking-wide shadow-xs transition-colors cursor-pointer"
            >
              {{ editingSheetId() ? 'Actualizar Cédula Oficial' : 'Guardar Cédula Oficial' }}
            </button>
          </div>

          <div
            *ngIf="savedSheets().length > 0"
            class="admin-white-card rounded-3xl p-6 sm:p-7 space-y-4"
          >
            <div class="pb-3 border-b border-slate-200/80 dark:border-[#232730]">
              <h2 class="text-base font-extrabold text-[#111111] dark:text-white">
                Cédulas Oficiales Guardadas
              </h2>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    class="border-b border-slate-200/80 dark:border-[#232730] text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    <th class="py-2.5 px-3">Jornada</th>
                    <th class="py-2.5 px-3">Encuentro</th>
                    <th class="py-2.5 px-3 text-center">Marcador</th>
                    <th class="py-2.5 px-3">Fecha</th>
                    <th class="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-[#232730]">
                  <tr *ngFor="let c of savedSheets()">
                    <td class="py-3 px-3 font-bold text-[#2E5B9A]">
                      {{ c.matchday }} · {{ c.cancha || 'Cancha 1' }}
                    </td>
                    <td class="py-3 px-3 font-extrabold text-[#111111] dark:text-white">
                      {{ c.homeTeam }} vs {{ c.awayTeam }}
                    </td>
                    <td class="py-3 px-3 text-center font-black text-sm">
                      {{ c.homeGoals }} - {{ c.awayGoals }}
                      <span
                        *ngIf="c.decidedByPenalties"
                        class="block text-[10px] font-bold text-amber-600 dark:text-amber-400"
                      >
                        Penales: {{ c.homePenalties }} - {{ c.awayPenalties }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-slate-500">{{ c.date }}</td>
                    <td class="py-3 px-3 text-right space-x-2">
                      <button
                        type="button"
                        (click)="editMatchSheet(c)"
                        class="px-3 py-1 rounded-full bg-[#E5EFFC] hover:bg-blue-100 text-[#2B548C] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        (click)="deleteMatchSheet(c.id)"
                        class="px-3 py-1 rounded-full bg-[#FFF1F2] hover:bg-rose-100 text-[#E11D48] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminPanelPageComponent {
  public solicitudesService = inject(SolicitudesEquiposService);
  public ligaData = inject(LigaDataService);

  activeTab = signal<AdminTab>('PANEL');
  feedbackMessage = signal<string>('');
  editingSheetId = signal<number | null>(null);

  savedSheets = signal<SavedMatchSheet[]>(
    JSON.parse(localStorage.getItem('md_cedulas_guardadas') || '[]'),
  );

  selectedMatchday = 'Jornada 9';
  selectedCancha = 'Cancha 1';
  homeTeam = '';
  awayTeam = '';
  homePenalties = 0;
  awayPenalties = 0;

  homePlayers = signal<PlayerEventRow[]>([]);
  awayPlayers = signal<PlayerEventRow[]>([]);

  constructor() {
    const equipos = this.ligaData.equipos();
    if (equipos.length >= 2) {
      this.homeTeam = equipos[0].name;
      this.awayTeam = equipos[1].name;
      this.onTeamChange('HOME', this.homeTeam);
      this.onTeamChange('AWAY', this.awayTeam);
    }
  }

  onTeamChange(side: 'HOME' | 'AWAY', teamName: string): void {
    const equipo = this.ligaData.equipos().find((e) => e.name === teamName);
    const roster = equipo ? (this.ligaData.rostersPorEquipo()[equipo.id] ?? []) : [];

    const rows: PlayerEventRow[] = [...roster]
      .sort((a, b) => a.dorsal - b.dorsal)
      .map((j, idx) => ({
        dorsal: j.dorsal,
        name: j.nick,
        position: j.position,
        minutes: idx < 7 ? 40 : 20,
        goals: 0,
        assists: 0,
        saves: 0,
        yellowCards: 0,
        redCards: 0,
      }));

    if (side === 'HOME') {
      this.homePlayers.set(rows);
    } else {
      this.awayPlayers.set(rows);
    }
  }

  pendingCount(): number {
    return this.solicitudesService.solicitudes().filter((t) => t.estatus === 'PENDIENTE').length;
  }

  approvedTeamsCount(): number {
    const aprobadas = this.solicitudesService
      .solicitudes()
      .filter((t) => t.estatus === 'APROBADO').length;
    return this.ligaData.equipos().length + aprobadas;
  }

  updateRequestStatus(id: number, status: 'APROBADO' | 'RECHAZADO'): void {
    this.solicitudesService.cambiarEstatus(id, status);
    this.feedbackMessage.set(`Estatus de equipo actualizado a ${status}.`);
  }

  totalHomeGoals(): number {
    return this.homePlayers().reduce((acc, p) => acc + (Number(p.goals) || 0), 0);
  }

  totalAwayGoals(): number {
    return this.awayPlayers().reduce((acc, p) => acc + (Number(p.goals) || 0), 0);
  }

  isDraw(): boolean {
    return this.totalHomeGoals() === this.totalAwayGoals();
  }

  editMatchSheet(sheet: SavedMatchSheet): void {
    this.editingSheetId.set(sheet.id);
    this.selectedMatchday = sheet.matchday;
    this.selectedCancha = sheet.cancha || 'Cancha 1';
    this.homeTeam = sheet.homeTeam;
    this.awayTeam = sheet.awayTeam;
    this.homePenalties = sheet.homePenalties ?? 0;
    this.awayPenalties = sheet.awayPenalties ?? 0;

    if (sheet.homePlayers) {
      this.homePlayers.set(sheet.homePlayers.map((p) => ({ ...p })));
    }
    if (sheet.awayPlayers) {
      this.awayPlayers.set(sheet.awayPlayers.map((p) => ({ ...p })));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEditSheet(): void {
    this.editingSheetId.set(null);
    this.homePenalties = 0;
    this.awayPenalties = 0;
  }

  saveMatchSheet(): void {
    const decidedByPenalties = this.isDraw();

    if (decidedByPenalties && Number(this.homePenalties) === Number(this.awayPenalties)) {
      this.feedbackMessage.set(
        'Reglamento sin empates: define un ganador distinto en la tanda de penales antes de guardar.',
      );
      return;
    }

    const editId = this.editingSheetId();
    const cedulaData: SavedMatchSheet = {
      id: editId ?? Date.now(),
      matchday: this.selectedMatchday,
      cancha: this.selectedCancha,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      homeGoals: this.totalHomeGoals(),
      awayGoals: this.totalAwayGoals(),
      decidedByPenalties,
      homePenalties: decidedByPenalties ? Number(this.homePenalties) || 0 : 0,
      awayPenalties: decidedByPenalties ? Number(this.awayPenalties) || 0 : 0,
      homePlayers: this.homePlayers().map((p) => ({ ...p })),
      awayPlayers: this.awayPlayers().map((p) => ({ ...p })),
      date: new Date().toLocaleDateString('es-MX'),
    };

    const actualizadas = editId
      ? this.savedSheets().map((c) => (c.id === editId ? cedulaData : c))
      : [cedulaData, ...this.savedSheets()];

    this.savedSheets.set(actualizadas);
    localStorage.setItem('md_cedulas_guardadas', JSON.stringify(actualizadas));

    const detallePenales = decidedByPenalties
      ? ` (Penales: ${cedulaData.homePenalties} - ${cedulaData.awayPenalties})`
      : '';

    this.feedbackMessage.set(
      `${editId ? 'Cédula actualizada' : 'Cédula guardada'}: ${this.homeTeam} ${this.totalHomeGoals()} - ${this.totalAwayGoals()} ${this.awayTeam}${detallePenales} (${this.selectedMatchday}).`,
    );
    this.editingSheetId.set(null);
  }

  deleteMatchSheet(id: number): void {
    if (this.editingSheetId() === id) {
      this.editingSheetId.set(null);
    }
    const actualizadas = this.savedSheets().filter((c) => c.id !== id);
    this.savedSheets.set(actualizadas);
    localStorage.setItem('md_cedulas_guardadas', JSON.stringify(actualizadas));
    this.feedbackMessage.set('Cédula eliminada del historial.');
  }
}
