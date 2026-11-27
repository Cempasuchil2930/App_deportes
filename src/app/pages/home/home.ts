import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LigaDataService } from '../../shared/services/liga-data';
export interface ReelItem {
  id: string;
  round: string;
  title: string;
  match: string;
  duration: string;
  protagonist: string;
  description: string;
  accentGradient: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private ligaData = inject(LigaDataService);

  positions = ['Todas', 'Delantera', 'Media', 'Defensa', 'Portera'];
  selectedPos = signal('Todas');
  selectedReel = signal<ReelItem | null>(null);

  filteredPlayers = computed(() => {
    const pos = this.selectedPos();
    const list = this.ligaData.jugadorasMvp();
    return pos === 'Todas' ? list : list.filter((p) => p.position === pos);
  });

  upcomingMatches = this.ligaData.proximosPartidos;
  topTeams = this.ligaData.top5Equipos;

  reels: ReelItem[] = [
    {
      id: 'reel-penales-j08',
      round: 'Jornada 08',
      title: 'Penales Cardíacos J08',
      match: 'Valquirias (4) 2 - 2 (3) F.C. Lionesses',
      duration: '0:42',
      protagonist: 'Camila "Cami" Mendoza • #9',
      description:
        'Tras empatar 2-2 en los 40 minutos reglamentarios, la serie se definió desde los once pasos con cobro cruzado al ángulo para darle los 3 puntos a Valquirias.',
      accentGradient: 'from-rose-600 via-purple-600 to-indigo-700',
    },
    {
      id: 'reel-atajada-sofi',
      round: 'Jornada 08',
      title: 'Vuelo de Sofi Navarro',
      match: 'F.C. Lionesses vs Lobas México',
      duration: '0:28',
      protagonist: 'Sofía "Sofi" Navarro • #1',
      description:
        'Doble reacción al minuto 37: desvió un disparo a quemarropa y alcanzó a manotear el contrarremate sobre la línea para mantener su portería invicta.',
      accentGradient: 'from-blue-600 via-cyan-600 to-emerald-600',
    },
  ];

  openReel(reel: ReelItem) {
    this.selectedReel.set(reel);
  }

  closeReel() {
    this.selectedReel.set(null);
  }
}
