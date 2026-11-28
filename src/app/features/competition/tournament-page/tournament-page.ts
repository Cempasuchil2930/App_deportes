import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LigaDataService } from '../../../shared/services/liga-data';

@Component({
  selector: 'app-tournament-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-page.html',
})
export class TournamentPageComponent {
  readonly ligaData = inject(LigaDataService);
  private router = inject(Router);

  filtroPartidos = signal<'FINALIZADO' | 'PROGRAMADO'>('FINALIZADO');
  expandedMatchId = signal<number | null>(3);

  readonly partidosFiltrados = computed(() =>
    this.ligaData.partidos().filter((p) => p.status === this.filtroPartidos()),
  );

  togglePartido(matchId: number) {
    this.expandedMatchId.update((curr) => (curr === matchId ? null : matchId));
  }

  irAEquipos() {
    this.router.navigate(['/equipos']);
  }

  irAPerfilJugadora(playerId: number) {
    this.router.navigate(['/jugadora', playerId]);
  }
}
