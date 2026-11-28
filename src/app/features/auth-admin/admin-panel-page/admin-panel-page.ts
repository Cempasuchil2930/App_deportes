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
  templateUrl: './admin-panel-page.html',
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
    const roster = equipo ? this.ligaData.rostersPorEquipo[equipo.id] ?? [] : [];

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