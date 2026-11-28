import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesEquiposService } from '../../../shared/services/solicitudes-equipos';

type AdminTab = 'PANEL' | 'CEDULA';

interface PlayerEventRow {
  dorsal: number;
  name: string;
  goals: number;
  yellowCards: number;
  redCards: number;
}

interface SavedMatchSheet {
  id: number;
  matchday: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  homePlayers?: PlayerEventRow[];
  awayPlayers?: PlayerEventRow[];
  date: string;
}

@Component({
  selector: 'app-admin-panel-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-transparent text-[#111111] dark:text-slate-100 p-4 sm:p-8 transition-colors duration-300"
    >
      <div class="max-w-[1140px] mx-auto space-y-6">
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
              <p class="text-3xl font-extrabold text-[#2E5B9A]">Jornada 4</p>
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
            <span
              >✎ Editando cédula guardada ({{ selectedMatchday }} · {{ homeTeam }} vs
              {{ awayTeam }})</span
            >
            <button type="button" (click)="cancelEditSheet()" class="underline cursor-pointer">
              Cancelar edición
            </button>
          </div>

          <div class="admin-white-card rounded-3xl p-6 sm:p-7 space-y-6">
            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200/80 dark:border-[#232730]"
            >
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >Jornada</label
                >
                <select
                  [(ngModel)]="selectedMatchday"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                >
                  <option value="Jornada 1">Jornada 1</option>
                  <option value="Jornada 2">Jornada 2</option>
                  <option value="Jornada 3">Jornada 3</option>
                  <option value="Jornada 4">Jornada 4</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >Equipo Local</label
                >
                <input
                  type="text"
                  [(ngModel)]="homeTeam"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >Equipo Visitante</label
                >
                <input
                  type="text"
                  [(ngModel)]="awayTeam"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-slate-50 dark:bg-[#0B0D10] border border-slate-200 dark:border-[#232730]"
                />
              </div>
            </div>

            <div class="flex items-center justify-center gap-6 py-2">
              <div class="text-center space-y-1">
                <p class="text-xs font-extrabold text-slate-600">{{ homeTeam }}</p>
                <p class="text-4xl font-black text-[#111111] dark:text-white">
                  {{ totalHomeGoals() }}
                </p>
              </div>

              <span class="text-lg font-extrabold text-slate-400">VS</span>

              <div class="text-center space-y-1">
                <p class="text-xs font-extrabold text-slate-600">{{ awayTeam }}</p>
                <p class="text-4xl font-black text-[#111111] dark:text-white">
                  {{ totalAwayGoals() }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="admin-white-card rounded-3xl p-6 space-y-4">
              <h2
                class="text-sm font-extrabold text-[#111111] dark:text-white pb-2 border-b border-slate-200/80 dark:border-[#232730]"
              >
                {{ homeTeam }} · Estadísticas individuales
              </h2>

              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="text-[11px] text-slate-500 uppercase border-b border-slate-100">
                    <th class="py-2">#</th>
                    <th class="py-2">Jugadora</th>
                    <th class="py-2 text-center">Goles</th>
                    <th class="py-2 text-center">TA</th>
                    <th class="py-2 text-center">TR</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-[#232730]">
                  <tr *ngFor="let p of homePlayers()">
                    <td class="py-2.5 font-bold text-slate-500">{{ p.dorsal }}</td>
                    <td class="py-2.5 font-bold">{{ p.name }}</td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        [(ngModel)]="p.goals"
                        class="w-12 text-center py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold"
                      />
                    </td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        max="2"
                        [(ngModel)]="p.yellowCards"
                        class="w-12 text-center py-1 rounded-lg bg-amber-50/70 border border-amber-200 font-bold text-amber-800"
                      />
                    </td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        [(ngModel)]="p.redCards"
                        class="w-12 text-center py-1 rounded-lg bg-rose-50/70 border border-rose-200 font-bold text-rose-800"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="admin-white-card rounded-3xl p-6 space-y-4">
              <h2
                class="text-sm font-extrabold text-[#111111] dark:text-white pb-2 border-b border-slate-200/80 dark:border-[#232730]"
              >
                {{ awayTeam }} · Estadísticas individuales
              </h2>

              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="text-[11px] text-slate-500 uppercase border-b border-slate-100">
                    <th class="py-2">#</th>
                    <th class="py-2">Jugadora</th>
                    <th class="py-2 text-center">Goles</th>
                    <th class="py-2 text-center">TA</th>
                    <th class="py-2 text-center">TR</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-[#232730]">
                  <tr *ngFor="let p of awayPlayers()">
                    <td class="py-2.5 font-bold text-slate-500">{{ p.dorsal }}</td>
                    <td class="py-2.5 font-bold">{{ p.name }}</td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        [(ngModel)]="p.goals"
                        class="w-12 text-center py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold"
                      />
                    </td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        max="2"
                        [(ngModel)]="p.yellowCards"
                        class="w-12 text-center py-1 rounded-lg bg-amber-50/70 border border-amber-200 font-bold text-amber-800"
                      />
                    </td>
                    <td class="py-2.5 text-center">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        [(ngModel)]="p.redCards"
                        class="w-12 text-center py-1 rounded-lg bg-rose-50/70 border border-rose-200 font-bold text-rose-800"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <td class="py-3 px-3 font-bold text-[#2E5B9A]">{{ c.matchday }}</td>
                    <td class="py-3 px-3 font-extrabold text-[#111111] dark:text-white">
                      {{ c.homeTeam }} vs {{ c.awayTeam }}
                    </td>
                    <td class="py-3 px-3 text-center font-black text-sm">
                      {{ c.homeGoals }} - {{ c.awayGoals }}
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

  activeTab = signal<AdminTab>('PANEL');
  feedbackMessage = signal<string>('');
  editingSheetId = signal<number | null>(null);

  savedSheets = signal<SavedMatchSheet[]>(
    JSON.parse(localStorage.getItem('md_cedulas_guardadas') || '[]'),
  );

  selectedMatchday = 'Jornada 4';
  homeTeam = 'Queer Goals F.C.';
  awayTeam = 'Valquirias United';

  homePlayers = signal<PlayerEventRow[]>([
    { dorsal: 10, name: 'Valeria Ríos', goals: 2, yellowCards: 0, redCards: 0 },
    { dorsal: 7, name: 'Camila Torres', goals: 1, yellowCards: 1, redCards: 0 },
    { dorsal: 4, name: 'Andrea Luna', goals: 0, yellowCards: 0, redCards: 0 },
  ]);

  awayPlayers = signal<PlayerEventRow[]>([
    { dorsal: 9, name: 'Sofía Mendoza', goals: 1, yellowCards: 0, redCards: 0 },
    { dorsal: 11, name: 'Renata Cruz', goals: 0, yellowCards: 0, redCards: 0 },
    { dorsal: 1, name: 'Daniela Ortiz', goals: 0, yellowCards: 0, redCards: 0 },
  ]);

  pendingCount(): number {
    return this.solicitudesService.solicitudes().filter((t) => t.estatus === 'PENDIENTE').length;
  }

  approvedTeamsCount(): number {
    const aprobadas = this.solicitudesService
      .solicitudes()
      .filter((t) => t.estatus === 'APROBADO').length;
    return 7 + aprobadas;
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

  editMatchSheet(sheet: SavedMatchSheet): void {
    this.editingSheetId.set(sheet.id);
    this.selectedMatchday = sheet.matchday;
    this.homeTeam = sheet.homeTeam;
    this.awayTeam = sheet.awayTeam;

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
  }

  saveMatchSheet(): void {
    const editId = this.editingSheetId();
    const cedulaData: SavedMatchSheet = {
      id: editId ?? Date.now(),
      matchday: this.selectedMatchday,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      homeGoals: this.totalHomeGoals(),
      awayGoals: this.totalAwayGoals(),
      homePlayers: this.homePlayers().map((p) => ({ ...p })),
      awayPlayers: this.awayPlayers().map((p) => ({ ...p })),
      date: new Date().toLocaleDateString('es-MX'),
    };

    const actualizadas = editId
      ? this.savedSheets().map((c) => (c.id === editId ? cedulaData : c))
      : [cedulaData, ...this.savedSheets()];

    this.savedSheets.set(actualizadas);
    localStorage.setItem('md_cedulas_guardadas', JSON.stringify(actualizadas));

    this.feedbackMessage.set(
      `${editId ? 'Cédula actualizada' : 'Cédula guardada'}: ${this.homeTeam} ${this.totalHomeGoals()} - ${this.totalAwayGoals()} ${this.awayTeam} (${this.selectedMatchday}).`,
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