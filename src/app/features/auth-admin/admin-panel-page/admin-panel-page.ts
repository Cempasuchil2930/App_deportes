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

  saveMatchSheet(): void {
    this.feedbackMessage.set(
      `Cédula guardada: ${this.homeTeam} ${this.totalHomeGoals()} - ${this.totalAwayGoals()} ${this.awayTeam} (${this.selectedMatchday}).`,
    );
  }
}
