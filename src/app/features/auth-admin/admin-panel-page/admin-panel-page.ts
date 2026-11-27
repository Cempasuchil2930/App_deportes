import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

export interface PendingRegistration {
  id: string;
  registrationType: 'CAPTAIN' | 'PLAYER';
  teamName?: string;
  fullName: string;
  shirtName: string;
  dorsal: number;
  position: string;
  pronouns: string;
  photoAuthorized: boolean;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  confidential: {
    phone: string;
    zone: string;
    emergencyContact: string;
    medicalConditions: string;
  };
  drawerOpen: boolean;
}

export interface TeamStanding {
  name: string;
  pj: number;
  pg: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
}

@Component({
  selector: 'app-admin-panel-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#FAF9F7] dark:bg-[#0B0D10] text-[#111111] dark:text-slate-100 p-4 sm:p-6 space-y-5">
      
      <!-- Banner Superior con Línea Cromática 2px y Botón Cerrar Sesión -->
      <div class="rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] shadow-xs overflow-hidden">
        <div class="h-[2px] w-full bg-gradient-to-r from-[#F43F5E] via-[#EAB308] via-[#10B981] via-[#3B82F6] to-[#8B5CF6]"></div>
        <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>
              <h1 class="text-lg font-extrabold tracking-tight text-[#111111] dark:text-white">
                Panel Administrativo & Cédula Arbitral Digital
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consulta de expedientes médicos confidenciales y captura oficial post-partido (40 min sin empates)
            </p>
          </div>

          <div class="flex items-center gap-2.5">
            <span class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFF1F2] dark:bg-rose-950/60 text-[#F43F5E] border border-[#FECDD3] dark:border-rose-800/70">
              Sesión: Admin Nayeli
            </span>
            <button
              type="button"
              (click)="logout()"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#F43F5E] hover:text-white dark:hover:bg-[#F43F5E] dark:hover:text-white transition-all cursor-pointer">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <!-- Toast de Recálculo en Vivo -->
      <div *ngIf="adminAlert()" class="rounded-xl px-4 py-3 bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800 text-xs font-bold text-[#059669] dark:text-emerald-300 flex items-center justify-between">
        <span>✓ {{ adminAlert() }}</span>
        <button type="button" (click)="adminAlert.set('')" class="underline cursor-pointer">Ocultar</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        <!-- COLUMNA IZQUIERDA (5 cols): BANDEJA DE SOLICITUDES PENDIENTES -->
        <div class="lg:col-span-5 rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-extrabold text-[#111111] dark:text-white">
              Bandeja de Solicitudes Pendientes
            </h2>
            <span class="w-6 h-6 rounded-full bg-[#FEF3C7] dark:bg-amber-950 text-[#B45309] dark:text-amber-300 text-xs font-extrabold flex items-center justify-center border border-[#FDE68A] dark:border-amber-800">
              {{ pendingCount() }}
            </span>
          </div>

          <div class="space-y-3.5">
            <div
              *ngFor="let item of registrations()"
              class="rounded-2xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] p-4 space-y-3 transition-all">
              
              <ng-container *ngIf="item.status !== 'PENDING'; else pendingCardTpl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span
                      [ngClass]="item.status === 'ACTIVE' ? 'bg-[#10B981]' : 'bg-[#F43F5E]'"
                      class="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold">
                      {{ item.status === 'ACTIVE' ? '✓' : '✕' }}
                    </span>
                    <div>
                      <p class="text-xs font-extrabold text-[#111111] dark:text-white">{{ item.fullName }}</p>
                      <p
                        [ngClass]="item.status === 'ACTIVE' ? 'text-[#10B981]' : 'text-[#F43F5E]'"
                        class="text-[11px] font-semibold">
                        {{ item.status === 'ACTIVE' ? 'Aprobada • Activa en 4.ª Edición' : 'Solicitud rechazada' }}
                      </p>
                    </div>
                  </div>
                  <span
                    [ngClass]="item.status === 'ACTIVE'
                      ? 'bg-[#ECFDF5] dark:bg-emerald-950 text-[#059669]'
                      : 'bg-[#FFF1F2] dark:bg-rose-950 text-[#F43F5E]'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {{ item.status === 'ACTIVE' ? 'ACTIVA' : 'RECHAZADA' }}
                  </span>
                </div>
              </ng-container>

              <ng-template #pendingCardTpl>
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="text-[11px] font-bold text-[#D97706] dark:text-amber-400 block">
                      {{ item.registrationType === 'CAPTAIN' ? 'Inscribir Equipo (Capitana)' : 'Jugadora Individual (Nueva)' }}
                    </span>
                    <h3 class="text-xs font-extrabold text-[#111111] dark:text-white mt-0.5">
                      {{ item.fullName }}
                      <span class="font-normal text-slate-400">("{{ item.shirtName }}" #{{ item.dorsal }})</span>
                    </h3>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {{ item.position }} • {{ item.pronouns }} • Img: {{ item.photoAuthorized ? 'Autorizada' : 'Avatar' }}
                    </p>
                  </div>

                  <button
                    type="button"
                    (click)="toggleConfidentialDrawer(item.id)"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F5F3FF] dark:bg-purple-950/70 text-[#7C3AED] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-800 hover:bg-[#8B5CF6] hover:text-white transition-all cursor-pointer shrink-0">
                    {{ item.drawerOpen ? 'Ocultar 🔒' : 'Expediente 🔒' }}
                  </button>
                </div>

                <!-- Cajón Morado Confidencial -->
                <div
                  *ngIf="item.drawerOpen"
                  class="rounded-xl bg-[#FAF7FF] dark:bg-[#171326] border border-[#DDD6FE] dark:border-purple-800/80 p-3 text-[11px] space-y-1">
                  <p class="font-extrabold text-[#5B21B6] dark:text-purple-200">Expediente Confidencial Protegido:</p>
                  <p class="text-slate-700 dark:text-slate-300">
                    <strong>Tel:</strong> {{ item.confidential.phone }} • <strong>Zona:</strong> {{ item.confidential.zone }}
                  </p>
                  <p class="text-slate-700 dark:text-slate-300">
                    <strong>Emergencia:</strong> {{ item.confidential.emergencyContact }}
                  </p>
                  <p class="text-[#7C3AED] dark:text-purple-300">
                    <strong>Médico:</strong> {{ item.confidential.medicalConditions }}
                  </p>
                </div>

                <div class="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    (click)="updateRegistrationStatus(item.id, 'ACTIVE')"
                    class="flex-1 py-2 px-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                    ✓ Aprobar (Activa)
                  </button>
                  <button
                    type="button"
                    (click)="updateRegistrationStatus(item.id, 'REJECTED')"
                    class="py-2 px-3.5 rounded-xl bg-white dark:bg-[#14171C] hover:bg-[#F43F5E] text-[#F43F5E] hover:text-white border border-[#FECDD3] dark:border-rose-800/80 text-xs font-bold transition-all cursor-pointer">
                    Rechazar
                  </button>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA (7 cols): CÉDULA ARBITRAL DIGITAL (40 MINUTOS) -->
        <form
          [formGroup]="matchSheetForm"
          (ngSubmit)="saveMatchSheet()"
          class="lg:col-span-7 rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] p-5 shadow-xs space-y-4">
          
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-sm font-extrabold text-[#111111] dark:text-white">
                Cédula Arbitral Digital (40 Minutos)
              </h2>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Al guardar, recalcula Tabla General (+3 pts ganador, 0 pts perdedor), Goleo, Porteras y Minutos
              </p>
            </div>
            <span class="text-[11px] font-bold text-[#10B981] shrink-0">
              Recálculo en Vivo
            </span>
          </div>

          <div class="rounded-2xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] p-4 space-y-3.5">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div class="sm:col-span-4">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  EQUIPO LOCAL
                </label>
                <select
                  formControlName="homeTeam"
                  class="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]">
                  <option *ngFor="let team of officialTeams" [value]="team">{{ team }}</option>
                </select>
              </div>

              <div class="sm:col-span-4 flex items-center justify-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="25"
                  formControlName="homeGoals"
                  class="w-12 h-11 rounded-xl text-center text-base font-extrabold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]" />
                <span class="text-sm font-bold text-slate-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  formControlName="awayGoals"
                  class="w-12 h-11 rounded-xl text-center text-base font-extrabold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]" />
              </div>

              <div class="sm:col-span-4">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  EQUIPO VISITANTE
                </label>
                <select
                  formControlName="awayTeam"
                  class="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]">
                  <option *ngFor="let team of officialTeams" [value]="team">{{ team }}</option>
                </select>
              </div>
            </div>

            <!-- Bloque Amarillo Tanda de Penales (#EAB308) -->
            <div
              [ngClass]="isDrawAt40() ? 'opacity-100 ring-2 ring-[#EAB308]/40' : 'opacity-45 pointer-events-none'"
              class="rounded-xl bg-[#FFFBEB] dark:bg-amber-950/35 border border-[#FDE68A] dark:border-amber-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition-all">
              <div>
                <p class="text-xs font-extrabold text-[#92400E] dark:text-amber-300">
                  Tanda de Penales (Si empatan al min 40):
                </p>
                <p class="text-[11px] font-medium text-[#B45309] dark:text-amber-200/90">
                  NO existen empates • Define al ganador de los +3 puntos
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs font-bold text-[#92400E] dark:text-amber-200">Local (</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  formControlName="homePenalties"
                  class="w-10 h-8 rounded-lg text-center text-xs font-extrabold bg-white dark:bg-[#14171C] border border-[#FDE68A] dark:border-amber-700 text-[#111111] dark:text-white focus:outline-none" />
                <span class="text-xs font-bold text-[#92400E] dark:text-amber-200">) - (</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  formControlName="awayPenalties"
                  class="w-10 h-8 rounded-lg text-center text-xs font-extrabold bg-white dark:bg-[#14171C] border border-[#FDE68A] dark:border-amber-700 text-[#111111] dark:text-white focus:outline-none" />
                <span class="text-xs font-bold text-[#92400E] dark:text-amber-200">) Visita</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] px-1">
              <span class="text-slate-500 dark:text-slate-400">Impacto Tabla General:</span>
              <span class="font-bold text-[#10B981]">
                {{ livePointsSummary() }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-2xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] p-4 space-y-3">
              <h3 class="text-xs font-extrabold text-[#F43F5E]">
                Goles & Tarjetas
              </h3>

              <div>
                <label class="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Goleadora del Partido
                </label>
                <div class="flex items-center gap-2">
                  <select
                    formControlName="topScorer"
                    class="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none">
                    <option value="Val (Queer Goals)">Val (Queer Goals)</option>
                    <option value="Cami (Valquirias)">Cami (Valquirias)</option>
                    <option value="Rayo (Atlético Diversa)">Rayo (Atlético Diversa)</option>
                    <option value="Dani P. (Queer Goals)">Dani P. (Queer Goals)</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    formControlName="scorerGoals"
                    class="w-11 h-9 rounded-xl text-center text-xs font-extrabold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white" />
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Tarjetas (TA / TR):
                </span>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    (click)="incrementCard('yellowCards')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#FEF3C7] dark:bg-amber-950/70 text-[#B45309] dark:text-amber-300 border border-[#FDE68A] dark:border-amber-800 cursor-pointer">
                    {{ matchSheetForm.get('yellowCards')?.value }} TA
                  </button>
                  <button
                    type="button"
                    (click)="incrementCard('redCards')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#FFE4E6] dark:bg-rose-950/70 text-[#E11D48] dark:text-rose-300 border border-[#FECDD3] dark:border-rose-800 cursor-pointer">
                    {{ matchSheetForm.get('redCards')?.value }} TR
                  </button>
                </div>
              </div>
            </div>

            <div class="rounded-2xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] p-4 space-y-3">
              <h3 class="text-xs font-extrabold text-[#3B82F6]">
                Atajadas & Cambios (40')
              </h3>

              <div>
                <label class="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Portera & Atajadas
                </label>
                <div class="flex items-center gap-2">
                  <select
                    formControlName="goalkeeper"
                    class="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none">
                    <option value="Sofi Navarro">Sofi Navarro</option>
                    <option value="Dani Vela">Dani Vela</option>
                    <option value="Fer Luna">Fer Luna</option>
                    <option value="Ale Castro">Ale Castro</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    formControlName="goalkeeperSaves"
                    class="w-11 h-9 rounded-xl text-center text-xs font-extrabold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Minuto de Cambio (1' a 39')
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="39"
                    formControlName="subMinute"
                    class="w-12 h-8 rounded-xl text-center text-xs font-extrabold bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white" />
                  <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Sale: {{ subMinutesOut() }}' &nbsp;|&nbsp; Entra: {{ subMinutesIn() }}'
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="!canSaveMatch()"
            class="w-full py-3 px-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold tracking-wide shadow-md hover:shadow-[0_8px_22px_-4px_rgba(16,185,129,0.4)] disabled:opacity-45 transition-all cursor-pointer">
            Guardar Partido y Recalcular Tabla
          </button>

          <div class="pt-2 border-t border-[#ECEAE6] dark:border-[#232730]">
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
              Tabla General Top 4 (Actualización en Vivo — 3 pts victoria / 0 pts derrota):
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div
                *ngFor="let row of standings().slice(0, 4); let idx = index"
                class="px-3 py-2 rounded-xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] flex items-center justify-between text-xs">
                <span class="font-bold truncate">{{ idx + 1 }}. {{ row.name }}</span>
                <span class="font-extrabold text-[#10B981] ml-1">{{ row.pts }} pts</span>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  `
})
export class AdminPanelPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  adminAlert = signal<string>('');

  officialTeams: string[] = [
    'Queer Goals',
    'Valquirias',
    'F.C. Lionesses',
    'Good Vibes',
    'Lobas México',
    'Atlético Diversa',
    'Bandidas F.C.',
    'All Stars GV',
    'Fénix F.C.',
    'Real Madrid',
    'TBD United',
    'Unknown'
  ];

  standings = signal<TeamStanding[]>([
    { name: 'Queer Goals', pj: 8, pg: 7, pp: 1, gf: 24, gc: 7, pts: 21 },
    { name: 'Valquirias', pj: 8, pg: 6, pp: 2, gf: 21, gc: 9, pts: 18 },
    { name: 'F.C. Lionesses', pj: 8, pg: 6, pp: 2, gf: 19, gc: 8, pts: 18 },
    { name: 'Good Vibes', pj: 8, pg: 5, pp: 3, gf: 17, gc: 11, pts: 15 },
    { name: 'Lobas México', pj: 8, pg: 5, pp: 3, gf: 16, gc: 12, pts: 15 },
    { name: 'Atlético Diversa', pj: 8, pg: 4, pp: 4, gf: 14, gc: 14, pts: 12 },
    { name: 'Bandidas F.C.', pj: 8, pg: 4, pp: 4, gf: 13, gc: 15, pts: 12 },
    { name: 'All Stars GV', pj: 8, pg: 4, pp: 4, gf: 12, gc: 16, pts: 12 },
    { name: 'Fénix F.C.', pj: 8, pg: 3, pp: 5, gf: 11, gc: 17, pts: 9 },
    { name: 'Real Madrid', pj: 8, pg: 2, pp: 6, gf: 9, gc: 18, pts: 6 },
    { name: 'TBD United', pj: 8, pg: 2, pp: 6, gf: 8, gc: 20, pts: 6 },
    { name: 'Unknown', pj: 8, pg: 1, pp: 7, gf: 6, gc: 23, pts: 3 }
  ]);

  registrations = signal<PendingRegistration[]>([
    {
      id: 'reg-1',
      registrationType: 'PLAYER',
      fullName: 'Daniela "Dani" Pacheco',
      shirtName: 'Dani P.',
      dorsal: 15,
      position: 'Medio',
      pronouns: 'Ella / She',
      photoAuthorized: false,
      status: 'PENDING',
      drawerOpen: false,
      confidential: {
        phone: '55 3419 8820',
        zone: 'Benito Juárez, CDMX',
        emergencyContact: 'Laura Pacheco (Madre) — 55 8821 0043',
        medicalConditions: 'Alergia leve a penicilina. Tipo de sangre A+.'
      }
    },
    {
      id: 'reg-2',
      registrationType: 'CAPTAIN',
      teamName: 'Fénix F.C.',
      fullName: 'Renata Vázquez',
      shirtName: 'Rena',
      dorsal: 10,
      position: 'Delantera',
      pronouns: 'Elle / They',
      photoAuthorized: true,
      status: 'PENDING',
      drawerOpen: true,
      confidential: {
        phone: '55 8392 1044',
        zone: 'Cuauhtémoc, CDMX',
        emergencyContact: 'Sofía León (Pareja) — 55 6120 9930',
        medicalConditions: 'Asma leve inducida por ejercicio (inhalador en mochila)'
      }
    }
  ]);

  pendingCount = computed(() =>
    this.registrations().filter(r => r.status === 'PENDING').length
  );

  matchSheetForm: FormGroup = this.fb.group({
    homeTeam: ['Queer Goals', [Validators.required]],
    awayTeam: ['Valquirias', [Validators.required]],
    homeGoals: [2, [Validators.required, Validators.min(0)]],
    awayGoals: [2, [Validators.required, Validators.min(0)]],
    homePenalties: [4, [Validators.min(0)]],
    awayPenalties: [3, [Validators.min(0)]],
    topScorer: ['Val (Queer Goals)'],
    scorerGoals: [2, [Validators.min(0)]],
    yellowCards: [1, [Validators.min(0)]],
    redCards: [0, [Validators.min(0)]],
    goalkeeper: ['Sofi Navarro'],
    goalkeeperSaves: [5, [Validators.min(0)]],
    subMinute: [25, [Validators.min(1), Validators.max(39)]]
  });

  logout(): void {
    this.authService.setRole('PUBLIC');
    this.router.navigate(['/auth']);
  }

  toggleConfidentialDrawer(id: string): void {
    this.registrations.update(list =>
      list.map(item =>
        item.id === id ? { ...item, drawerOpen: !item.drawerOpen } : item
      )
    );
  }

  updateRegistrationStatus(id: string, status: 'ACTIVE' | 'REJECTED'): void {
    const target = this.registrations().find(r => r.id === id);
    this.registrations.update(list =>
      list.map(item => (item.id === id ? { ...item, status } : item))
    );
    if (target) {
      this.adminAlert.set(
        status === 'ACTIVE'
          ? `${target.fullName} aprobada como jugadora ACTIVA en la 4.ª Edición.`
          : `Solicitud de ${target.fullName} rechazada.`
      );
    }
  }

  isDrawAt40(): boolean {
    const hg = Number(this.matchSheetForm.get('homeGoals')?.value ?? 0);
    const ag = Number(this.matchSheetForm.get('awayGoals')?.value ?? 0);
    return hg === ag;
  }

  canSaveMatch(): boolean {
    const home = this.matchSheetForm.get('homeTeam')?.value;
    const away = this.matchSheetForm.get('awayTeam')?.value;
    if (!home || !away || home === away) return false;

    if (this.isDrawAt40()) {
      const hp = Number(this.matchSheetForm.get('homePenalties')?.value ?? 0);
      const ap = Number(this.matchSheetForm.get('awayPenalties')?.value ?? 0);
      return hp !== ap;
    }
    return true;
  }

  livePointsSummary(): string {
    const home = this.matchSheetForm.get('homeTeam')?.value;
    const away = this.matchSheetForm.get('awayTeam')?.value;
    const hg = Number(this.matchSheetForm.get('homeGoals')?.value ?? 0);
    const ag = Number(this.matchSheetForm.get('awayGoals')?.value ?? 0);

    if (home === away) return 'Selecciona dos equipos distintos';

    if (hg > ag) {
      return `${home} +3 pts (${hg}-${ag} en 40') • ${away} 0 pts`;
    }
    if (ag > hg) {
      return `${away} +3 pts (${ag}-${hg} en 40') • ${home} 0 pts`;
    }

    const hp = Number(this.matchSheetForm.get('homePenalties')?.value ?? 0);
    const ap = Number(this.matchSheetForm.get('awayPenalties')?.value ?? 0);
    if (hp > ap) {
      return `${home} +3 pts (Penales ${hp}-${ap}) • ${away} 0 pts`;
    }
    if (ap > hp) {
      return `${away} +3 pts (Penales ${ap}-${hp}) • ${home} 0 pts`;
    }
    return 'Empate en penales: define al ganador de los +3 puntos';
  }

  subMinutesOut(): number {
    const min = Number(this.matchSheetForm.get('subMinute')?.value ?? 25);
    return Math.min(39, Math.max(1, min));
  }

  subMinutesIn(): number {
    return 40 - this.subMinutesOut();
  }

  incrementCard(controlName: 'yellowCards' | 'redCards'): void {
    const current = Number(this.matchSheetForm.get(controlName)?.value ?? 0);
    this.matchSheetForm.patchValue({ [controlName]: current + 1 });
  }

  saveMatchSheet(): void {
    if (!this.canSaveMatch()) return;

    const val = this.matchSheetForm.value;
    const hg = Number(val.homeGoals);
    const ag = Number(val.awayGoals);
    const hp = Number(val.homePenalties);
    const ap = Number(val.awayPenalties);

    const homeWon = hg > ag || (hg === ag && hp > ap);
    const winner = homeWon ? val.homeTeam : val.awayTeam;
    const loser = homeWon ? val.awayTeam : val.homeTeam;

    this.standings.update(table => {
      const updated = table.map(team => {
        if (team.name === val.homeTeam) {
          return {
            ...team,
            pj: team.pj + 1,
            pg: homeWon ? team.pg + 1 : team.pg,
            pp: homeWon ? team.pp : team.pp + 1,
            gf: team.gf + hg,
            gc: team.gc + ag,
            pts: homeWon ? team.pts + 3 : team.pts
          };
        }
        if (team.name === val.awayTeam) {
          return {
            ...team,
            pj: team.pj + 1,
            pg: !homeWon ? team.pg + 1 : team.pg,
            pp: !homeWon ? team.pp : team.pp + 1,
            gf: team.gf + ag,
            gc: team.gc + hg,
            pts: !homeWon ? team.pts + 3 : team.pts
          };
        }
        return team;
      });

      return updated.sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));
    });

    this.adminAlert.set(
      `Cédula guardada: ${winner} suma +3 pts y ${loser} 0 pts. Cambio registrado (${this.subMinutesOut()}' / ${this.subMinutesIn()}').`
    );
  }
}