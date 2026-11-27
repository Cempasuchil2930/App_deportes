import { Injectable, computed, signal } from '@angular/core';

export interface EquipoTabla {
  id: number;
  abbr: string;
  name: string;
  pj: number;
  pg: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
  color: string;
}

export interface JugadoraMvp {
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

export interface PartidoDominical {
  id: number;
  round: string;
  time: string;
  home: string;
  away: string;
  status: 'PROGRAMADO' | 'FINALIZADO';
  score?: string;
}

export interface SesionEntrenamiento {
  id: number;
  title: string;
  coach: string;
  specialty: string;
  level: 'Principiante' | 'Intermedio' | 'Todos los niveles';
  schedule: string;
  venue: string;
  spotsLeft: number;
  price: string;
}

@Injectable({
  providedIn: 'root',
})
export class LigaDataService {
  // 12 Equipos Oficiales (Formato 40 min, sin empates: 3 pts victoria / 0 derrota)
  readonly equipos = signal<EquipoTabla[]>([
    {
      id: 1,
      abbr: 'QG',
      name: 'Queer Goals',
      pj: 8,
      pg: 7,
      pp: 1,
      gf: 24,
      gc: 8,
      pts: 21,
      color: 'bg-purple-600',
    },
    {
      id: 2,
      abbr: 'VLQ',
      name: 'Valquirias',
      pj: 8,
      pg: 6,
      pp: 2,
      gf: 21,
      gc: 10,
      pts: 18,
      color: 'bg-rose-600',
    },
    {
      id: 3,
      abbr: 'LIO',
      name: 'F.C. Lionesses',
      pj: 8,
      pg: 6,
      pp: 2,
      gf: 19,
      gc: 11,
      pts: 18,
      color: 'bg-blue-600',
    },
    {
      id: 4,
      abbr: 'GV',
      name: 'Good Vibes',
      pj: 8,
      pg: 5,
      pp: 3,
      gf: 16,
      gc: 12,
      pts: 15,
      color: 'bg-emerald-600',
    },
    {
      id: 5,
      abbr: 'LOB',
      name: 'Lobas México',
      pj: 8,
      pg: 5,
      pp: 3,
      gf: 15,
      gc: 13,
      pts: 15,
      color: 'bg-amber-600',
    },
    {
      id: 6,
      abbr: 'ATD',
      name: 'Atlético Diversa',
      pj: 8,
      pg: 4,
      pp: 4,
      gf: 14,
      gc: 14,
      pts: 12,
      color: 'bg-cyan-600',
    },
    {
      id: 7,
      abbr: 'FEN',
      name: 'Fénix CDMX',
      pj: 8,
      pg: 4,
      pp: 4,
      gf: 13,
      gc: 15,
      pts: 12,
      color: 'bg-orange-600',
    },
    {
      id: 8,
      abbr: 'SOR',
      name: 'Sororas FC',
      pj: 8,
      pg: 3,
      pp: 5,
      gf: 11,
      gc: 16,
      pts: 9,
      color: 'bg-pink-600',
    },
    {
      id: 9,
      abbr: 'AUR',
      name: 'Auroras',
      pj: 8,
      pg: 3,
      pp: 5,
      gf: 10,
      gc: 17,
      pts: 9,
      color: 'bg-indigo-600',
    },
    {
      id: 10,
      abbr: 'IMP',
      name: 'Imperio Rosa',
      pj: 8,
      pg: 2,
      pp: 6,
      gf: 9,
      gc: 18,
      pts: 6,
      color: 'bg-fuchsia-600',
    },
    {
      id: 11,
      abbr: 'REB',
      name: 'Rebeldes',
      pj: 8,
      pg: 2,
      pp: 6,
      gf: 8,
      gc: 20,
      pts: 6,
      color: 'bg-teal-600',
    },
    {
      id: 12,
      abbr: 'LIB',
      name: 'Libres FC',
      pj: 8,
      pg: 1,
      pp: 7,
      gf: 6,
      gc: 22,
      pts: 3,
      color: 'bg-slate-600',
    },
  ]);

  readonly top5Equipos = computed(() =>
    [...this.equipos()].sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc)).slice(0, 5),
  );

  readonly jugadorasMvp = signal<JugadoraMvp[]>([
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
  ]);

  readonly partidos = signal<PartidoDominical[]>([
    {
      id: 1,
      round: 'Jornada 09',
      time: 'Dom 09:00 • Cancha 1',
      home: 'Queer Goals',
      away: 'Valquirias',
      status: 'PROGRAMADO',
    },
    {
      id: 2,
      round: 'Jornada 09',
      time: 'Dom 09:50 • Cancha 1',
      home: 'F.C. Lionesses',
      away: 'Lobas México',
      status: 'PROGRAMADO',
    },
    {
      id: 3,
      round: 'Jornada 08',
      time: 'Finalizado',
      home: 'Queer Goals',
      away: 'Good Vibes',
      status: 'FINALIZADO',
      score: '3 - 1',
    },
    {
      id: 4,
      round: 'Jornada 08',
      time: 'Penales (4-3)',
      home: 'Valquirias',
      away: 'F.C. Lionesses',
      status: 'FINALIZADO',
      score: '2 - 2',
    },
  ]);

  readonly proximosPartidos = computed(() =>
    this.partidos().filter((p) => p.status === 'PROGRAMADO'),
  );

  readonly entrenamientos = signal<SesionEntrenamiento[]>([
    {
      id: 1,
      title: 'Control Orientado y Definición en Área',
      coach: 'Coach Nayeli',
      specialty: 'Técnica Individual y Gol',
      level: 'Todos los niveles',
      schedule: 'Miércoles 19:30 - 21:00',
      venue: 'Deportivo Benito Juárez • Cancha 2',
      spotsLeft: 6,
      price: '$80 MXN',
    },
    {
      id: 2,
      title: 'Clínica de Porteras: Achique y Penales',
      coach: 'Coach Mariana Solís',
      specialty: 'Entrenamiento de Porteras',
      level: 'Intermedio',
      schedule: 'Viernes 18:30 - 20:00',
      venue: 'Parque Lira • Sintética Norte',
      spotsLeft: 4,
      price: '$100 MXN',
    },
    {
      id: 3,
      title: 'Iniciación al Fútbol 7 y Posicionamiento',
      coach: 'Coach Renata Cruz',
      specialty: 'Fundamentos Tácticos',
      level: 'Principiante',
      schedule: 'Sábado 10:00 - 11:30',
      venue: 'Deportivo Reynosa • Cancha 1',
      spotsLeft: 9,
      price: '$60 MXN',
    },
  ]);
}
