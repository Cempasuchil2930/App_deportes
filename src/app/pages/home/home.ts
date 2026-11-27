import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MvpPlayer {
  id: number;
  badge: string;
  badgeColor: string;
  initials: string;
  name: string;
  team: string;
  position: 'Delantera' | 'Media' | 'Defensa' | 'Portera';
  pronouns: string;
  dorsal: number;
  statsLine: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  positions = ['Todas', 'Delantera', 'Media', 'Defensa', 'Portera'];
  selectedPos = signal('Todas');

  players: MvpPlayer[] = [
    {
      id: 20,
      badge: 'Jugadora de la Jornada',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      initials: 'VA',
      name: 'Valeria "Val" Ríos',
      team: 'Queer Goals',
      position: 'Media',
      pronouns: 'Ella / She',
      dorsal: 20,
      statsLine: "8 PJ • 310' • 9 Goles • 6 Asist",
    },
    {
      id: 9,
      badge: 'Goleadora',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      initials: 'CA',
      name: 'Camila "Cami" Mendoza',
      team: 'Valquirias',
      position: 'Delantera',
      pronouns: 'Elle / They',
      dorsal: 9,
      statsLine: "8 PJ • 320' • 12 Goles • 2 Asist",
    },
    {
      id: 1,
      badge: 'Mejor Portera',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      initials: 'SO',
      name: 'Sofía "Sofi" Navarro',
      team: 'F.C. Lionesses',
      position: 'Portera',
      pronouns: 'Ella / She',
      dorsal: 1,
      statsLine: "8 PJ • 320' • 36 Atajadas",
    },
    {
      id: 7,
      badge: 'Muro Defensivo',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      initials: 'RA',
      name: 'Alex "Rayo" Torres',
      team: 'Atlético Diversa',
      position: 'Defensa',
      pronouns: 'Elle / They',
      dorsal: 7,
      statsLine: "8 PJ • 295' • 3 Goles • 4 Asist",
    },
  ];

  filteredPlayers = computed(() => {
    const pos = this.selectedPos();
    return pos === 'Todas' ? this.players : this.players.filter((p) => p.position === pos);
  });

  upcomingMatches = [
    { round: 'Jornada 09', time: 'Dom 09:00 • Cancha 1', home: 'Queer Goals', away: 'Valquirias' },
    {
      round: 'Jornada 09',
      time: 'Dom 09:50 • Cancha 1',
      home: 'F.C. Lionesses',
      away: 'Lobas México',
    },
  ];

  topTeams = [
    { abbr: 'QG', name: 'Queer Goals', record: '7G-1P', pts: 21, color: 'bg-purple-600' },
    { abbr: 'VLQ', name: 'Valquirias', record: '6G-2P', pts: 18, color: 'bg-rose-600' },
    { abbr: 'LIO', name: 'F.C. Lionesses', record: '6G-2P', pts: 18, color: 'bg-blue-600' },
    { abbr: 'GV', name: 'Good Vibes', record: '5G-3P', pts: 15, color: 'bg-emerald-600' },
    { abbr: 'LOB', name: 'Lobas México', record: '5G-3P', pts: 15, color: 'bg-amber-600' },
  ];
}
