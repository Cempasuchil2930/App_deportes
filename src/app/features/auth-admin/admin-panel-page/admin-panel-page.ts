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
  templateUrl: './admin-panel-page.html',
})
export class AdminPanelPageComponent {
  public solicitudesService = inject(SolicitudesEquiposService);

  activeTab = signal<AdminTab>('PANEL');
  feedbackMessage = signal<string>('');
  editingSheetId = signal<number | null>(null);

  savedSheets = signal<SavedMatchSheet[]>(
    JSON.parse(localStorage.getItem('md_cedulas_guardadas') || '[]')
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
      `${editId ? 'Cédula actualizada' : 'Cédula guardada'}: ${this.homeTeam} ${this.totalHomeGoals()} - ${this.totalAwayGoals()} ${this.awayTeam} (${this.selectedMatchday}).`
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
