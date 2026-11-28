import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LigaDataService } from '../../../shared/services/liga-data';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams-page.html',
})
export class TeamsPageComponent {
  readonly ligaData = inject(LigaDataService);
  private router = inject(Router);

  selectedTeamId = signal<number>(1);

  readonly equipoActivo = computed(
    () =>
      this.ligaData.equipos().find((e) => e.id === this.selectedTeamId()) ??
      this.ligaData.equipos()[0],
  );

  readonly posicionActiva = computed(() => this.obtenerPosicion(this.selectedTeamId()));

  readonly rosterActivo = computed(
    () => this.ligaData.rostersPorEquipo[this.selectedTeamId()] ?? [],
  );

  readonly rosterOrdenado = computed(() =>
    [...this.rosterActivo()].sort((a, b) => a.dorsal - b.dorsal),
  );

  readonly miniTablaContexto = computed(() => {
    const ordenada = this.ligaData.tablaOrdenada();
    const idx = ordenada.findIndex((t) => t.id === this.selectedTeamId());
    const start = Math.max(0, Math.min(idx - 1, ordenada.length - 3));
    return ordenada.slice(start, start + 3).map((team, i) => ({
      pos: start + i + 1,
      team,
    }));
  });

  obtenerPosicion(teamId: number): number {
    const idx = this.ligaData.tablaOrdenada().findIndex((t) => t.id === teamId);
    return idx >= 0 ? idx + 1 : 1;
  }

  seleccionarEquipo(teamId: number) {
    this.selectedTeamId.set(teamId);
  }

  irAPerfilJugadora(playerId: number) {
    this.router.navigate(['/jugadora', playerId]);
  }

  irATablaCompleta() {
    this.router.navigate(['/torneo']);
  }
}
