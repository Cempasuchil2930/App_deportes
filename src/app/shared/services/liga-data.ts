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

export interface JugadoraRosterPublica {
  playerId: number;
  nick: string;
  dorsal: number;
  position: 'Portera' | 'Defensa' | 'Media' | 'Delantera';
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

export interface EventoCronologia {
  min: string;
  text: string;
}

export interface PartidoDominical {
  id: number;
  round: string;
  time: string;
  home: string;
  away: string;
  status: 'PROGRAMADO' | 'FINALIZADO';
  score?: string;
  penalties?: string;
  mvp?: string;
  timeline?: EventoCronologia[];
}

export interface PerfilJugadoraFotMob {
  id: number;
  shortLabel: string;
  fullName: string;
  initials: string;
  dorsal: number;
  team: string;
  position: string;
  pronouns: 'Ella / She' | 'Elle / They' | 'Él / He';
  imageConsent: boolean;
  accentColor: string;
  physical: {
    height: string;
    age: string;
    birth: string;
    foot: string;
  };
  season4: {
    matchesMinutes: string;
    goals: number;
    saves: number;
    cards: string;
  };
  radar: {
    Ataque: number;
    Fisico: number;
    Velocidad: number;
    Pase: number;
    Regate: number;
    Defensa: number;
  };
  recentMatches: {
    jornada: string;
    rival: string;
    score: string;
    mins: string;
    highlight: string;
    mvp: boolean;
  }[];
  career: {
    edition: string;
    team: string;
    pj: number;
    stat: string;
    badge: string;
  }[];
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
  readonly equipos = signal<EquipoTabla[]>([
    { id: 1, abbr: 'QG', name: 'Queer Goals', pj: 8, pg: 7, pp: 1, gf: 24, gc: 8, pts: 21, color: 'bg-purple-600' },
    { id: 2, abbr: 'VLQ', name: 'Valquirias', pj: 8, pg: 6, pp: 2, gf: 21, gc: 10, pts: 18, color: 'bg-rose-600' },
    { id: 3, abbr: 'LIO', name: 'F.C. Lionesses', pj: 8, pg: 6, pp: 2, gf: 19, gc: 11, pts: 18, color: 'bg-blue-600' },
    { id: 4, abbr: 'GV', name: 'Good Vibes', pj: 8, pg: 5, pp: 3, gf: 16, gc: 12, pts: 15, color: 'bg-emerald-600' },
    { id: 5, abbr: 'LOB', name: 'Lobas México', pj: 8, pg: 5, pp: 3, gf: 15, gc: 13, pts: 15, color: 'bg-amber-600' },
    { id: 6, abbr: 'ATD', name: 'Atlético Diversa', pj: 8, pg: 4, pp: 4, gf: 14, gc: 14, pts: 12, color: 'bg-cyan-600' },
    { id: 7, abbr: 'FEN', name: 'Fénix CDMX', pj: 8, pg: 4, pp: 4, gf: 13, gc: 15, pts: 12, color: 'bg-orange-600' },
    { id: 8, abbr: 'SOR', name: 'Sororas FC', pj: 8, pg: 3, pp: 5, gf: 11, gc: 16, pts: 9, color: 'bg-pink-600' },
    { id: 9, abbr: 'AUR', name: 'Auroras', pj: 8, pg: 3, pp: 5, gf: 10, gc: 17, pts: 9, color: 'bg-indigo-600' },
    { id: 10, abbr: 'IMP', name: 'Imperio Rosa', pj: 8, pg: 2, pp: 6, gf: 9, gc: 18, pts: 6, color: 'bg-fuchsia-600' },
    { id: 11, abbr: 'REB', name: 'Rebeldes', pj: 8, pg: 2, pp: 6, gf: 8, gc: 20, pts: 6, color: 'bg-teal-600' },
    { id: 12, abbr: 'LIB', name: 'Libres FC', pj: 8, pg: 1, pp: 7, gf: 6, gc: 22, pts: 3, color: 'bg-slate-600' },
  ]);

  readonly tablaOrdenada = computed(() =>
    [...this.equipos()].sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc)),
  );

  readonly top5Equipos = computed(() => this.tablaOrdenada().slice(0, 5));

  readonly rostersPorEquipo: Record<number, JugadoraRosterPublica[]> = {
    1: [
      { playerId: 20, nick: 'Val', dorsal: 20, position: 'Media' },
      { playerId: 15, nick: 'Dani', dorsal: 1, position: 'Portera' },
      { playerId: 1, nick: 'Majo', dorsal: 4, position: 'Defensa' },
      { playerId: 9, nick: 'Pau', dorsal: 11, position: 'Delantera' },
      { playerId: 20, nick: 'Lu', dorsal: 8, position: 'Media' },
      { playerId: 7, nick: 'Cris', dorsal: 5, position: 'Defensa' },
    ],
    2: [
      { playerId: 9, nick: 'Cami', dorsal: 9, position: 'Delantera' },
      { playerId: 1, nick: 'Ale', dorsal: 1, position: 'Portera' },
      { playerId: 20, nick: 'Rena', dorsal: 10, position: 'Media' },
      { playerId: 15, nick: 'Sam', dorsal: 3, position: 'Defensa' },
      { playerId: 9, nick: 'Fer', dorsal: 7, position: 'Delantera' },
      { playerId: 7, nick: 'Nati', dorsal: 6, position: 'Defensa' },
    ],
    3: [
      { playerId: 1, nick: 'Sofi', dorsal: 1, position: 'Portera' },
      { playerId: 20, nick: 'Andy', dorsal: 10, position: 'Media' },
      { playerId: 9, nick: 'Gaby', dorsal: 9, position: 'Delantera' },
      { playerId: 7, nick: 'Mar', dorsal: 4, position: 'Defensa' },
      { playerId: 15, nick: 'Tere', dorsal: 8, position: 'Media' },
      { playerId: 1, nick: 'Isa', dorsal: 2, position: 'Defensa' },
    ],
    4: [
      { playerId: 1, nick: 'Fer Luna', dorsal: 1, position: 'Portera' },
      { playerId: 9, nick: 'Meli', dorsal: 14, position: 'Delantera' },
      { playerId: 20, nick: 'Clau', dorsal: 6, position: 'Media' },
      { playerId: 15, nick: 'Vane', dorsal: 3, position: 'Defensa' },
    ],
    5: [
      { playerId: 9, nick: 'Kari', dorsal: 11, position: 'Delantera' },
      { playerId: 1, nick: 'Bere', dorsal: 1, position: 'Portera' },
      { playerId: 7, nick: 'Xime', dorsal: 5, position: 'Defensa' },
      { playerId: 20, nick: 'Ame', dorsal: 8, position: 'Media' },
    ],
    6: [
      { playerId: 7, nick: 'Rayo', dorsal: 7, position: 'Defensa' },
      { playerId: 15, nick: 'Dani P.', dorsal: 15, position: 'Media' },
      { playerId: 1, nick: 'Lili', dorsal: 1, position: 'Portera' },
      { playerId: 9, nick: 'Sol', dorsal: 9, position: 'Delantera' },
    ],
    7: [
      { playerId: 9, nick: 'Nadia', dorsal: 9, position: 'Delantera' },
      { playerId: 1, nick: 'Alba', dorsal: 1, position: 'Portera' },
      { playerId: 7, nick: 'Ceci', dorsal: 5, position: 'Defensa' },
    ],
    8: [
      { playerId: 20, nick: 'Roxy', dorsal: 10, position: 'Media' },
      { playerId: 1, nick: 'Moni', dorsal: 1, position: 'Portera' },
      { playerId: 9, nick: 'Emi', dorsal: 12, position: 'Delantera' },
    ],
    9: [
      { playerId: 20, nick: 'Pame', dorsal: 8, position: 'Media' },
      { playerId: 1, nick: 'Tania', dorsal: 1, position: 'Portera' },
      { playerId: 9, nick: 'Daf', dorsal: 19, position: 'Delantera' },
    ],
    10: [
      { playerId: 9, nick: 'Caro', dorsal: 7, position: 'Delantera' },
      { playerId: 1, nick: 'Eli', dorsal: 1, position: 'Portera' },
      { playerId: 20, nick: 'Gina', dorsal: 6, position: 'Media' },
    ],
    11: [
      { playerId: 15, nick: 'Yessi', dorsal: 11, position: 'Media' },
      { playerId: 1, nick: 'Luz', dorsal: 1, position: 'Portera' },
      { playerId: 7, nick: 'Adri', dorsal: 4, position: 'Defensa' },
    ],
    12: [
      { playerId: 15, nick: 'Susi', dorsal: 10, position: 'Media' },
      { playerId: 1, nick: 'Mara', dorsal: 1, position: 'Portera' },
      { playerId: 7, nick: 'Vero', dorsal: 2, position: 'Defensa' },
    ],
  };

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

  readonly topGoleadoras = [
    { rank: 1, playerId: 9, name: 'Cami', team: 'Valquirias', goals: 12 },
    { rank: 2, playerId: 20, name: 'Val', team: 'Queer Goals', goals: 9 },
    { rank: 3, playerId: 7, name: 'Rayo', team: 'Atlético Diversa', goals: 3 },
  ];

  readonly topPorteras = [
    { rank: 1, playerId: 1, name: 'Sofi Navarro', team: 'F.C. Lionesses', stat: '36 / 8' },
    { rank: 2, playerId: 15, name: 'Dani Vela', team: 'Queer Goals', stat: '31 / 7' },
    { rank: 3, playerId: 1, name: 'Fer Luna', team: 'Good Vibes', stat: '27 / 11' },
    { rank: 4, playerId: 1, name: 'Ale Castro', team: 'Valquirias', stat: '25 / 9' },
  ];

  readonly perfilesJugadoras: PerfilJugadoraFotMob[] = [
    {
      id: 1,
      shortLabel: 'Sofi #1 (Foto Autorizada)',
      fullName: 'Sofía "Sofi" Navarro',
      initials: 'SO',
      dorsal: 1,
      team: 'F.C. Lionesses',
      position: 'Portera Titular',
      pronouns: 'Ella / She',
      imageConsent: true,
      accentColor: '#3B82F6',
      physical: { height: '1.75 m', age: '27 años', birth: '19 Nov 1999', foot: 'Izquierdo' },
      season4: { matchesMinutes: "8 / 320'", goals: 0, saves: 36, cards: '0 TA • 0 TR' },
      radar: { Ataque: 42, Fisico: 86, Velocidad: 78, Pase: 81, Regate: 64, Defensa: 94 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Lobas México', score: '2 - 0 (G)', mins: "40'", highlight: '5 atajadas • Portería invicta', mvp: true },
        { jornada: 'J07', rival: 'vs Queer Goals', score: '1 (3) - (4) 1 (P)', mins: "40'", highlight: '6 atajadas + 1 penal detenido', mvp: false },
        { jornada: 'J06', rival: 'vs Good Vibes', score: '3 - 1 (G)', mins: "40'", highlight: '4 atajadas clave en 2.º tiempo', mvp: false },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'F.C. Lionesses', pj: 8, stat: '36 Atajadas • 8 GC (1.00 prom)', badge: 'Líder Portería' },
        { edition: '3.ª Edición', team: 'F.C. Lionesses', pj: 11, stat: '48 Atajadas • Subcampeona', badge: 'Guante de Oro' },
        { edition: '2.ª Edición', team: 'F.C. Lionesses', pj: 9, stat: '33 Atajadas • Semifinalista', badge: 'Titular' },
      ],
    },
    {
      id: 20,
      shortLabel: 'Val #20 (Foto Autorizada)',
      fullName: 'Valeria "Val" Ríos',
      initials: 'VA',
      dorsal: 20,
      team: 'Queer Goals',
      position: 'Media Creativa',
      pronouns: 'Ella / She',
      imageConsent: true,
      accentColor: '#10B981',
      physical: { height: '1.68 m', age: '25 años', birth: '04 Mar 2001', foot: 'Derecho' },
      season4: { matchesMinutes: "8 / 310'", goals: 9, saves: 0, cards: '1 TA • 0 TR' },
      radar: { Ataque: 91, Fisico: 82, Velocidad: 89, Pase: 95, Regate: 93, Defensa: 74 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Valquirias', score: '1 (4) - (3) 1 (G)', mins: "40'", highlight: "1 gol (18') + penal decisivo", mvp: true },
        { jornada: 'J07', rival: 'vs F.C. Lionesses', score: '1 (4) - (3) 1 (G)', mins: "40'", highlight: '1 asistencia + MVP Jornada', mvp: true },
        { jornada: 'J06', rival: 'vs Atlético Diversa', score: '4 - 1 (G)', mins: "35'", highlight: '2 goles y 1 asistencia', mvp: false },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Queer Goals', pj: 8, stat: '9 Goles • 6 Asistencias', badge: 'Jugadora de la Jornada' },
        { edition: '3.ª Edición', team: 'Queer Goals', pj: 11, stat: '14 Goles • Campeona', badge: 'MVP Final' },
      ],
    },
    {
      id: 9,
      shortLabel: 'Cami #9 (Foto Autorizada)',
      fullName: 'Camila "Cami" Mendoza',
      initials: 'CA',
      dorsal: 9,
      team: 'Valquirias',
      position: 'Delantera Centro',
      pronouns: 'Elle / They',
      imageConsent: true,
      accentColor: '#F43F5E',
      physical: { height: '1.71 m', age: '26 años', birth: '12 Ago 2000', foot: 'Ambidiestro' },
      season4: { matchesMinutes: "8 / 320'", goals: 12, saves: 0, cards: '0 TA • 0 TR' },
      radar: { Ataque: 96, Fisico: 85, Velocidad: 92, Pase: 79, Regate: 88, Defensa: 52 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Queer Goals', score: '1 (3) - (4) 1 (P)', mins: "40'", highlight: "1 gol al minuto 31'", mvp: false },
        { jornada: 'J07', rival: 'vs Sororas FC', score: '4 - 1 (G)', mins: "40'", highlight: "Hat-trick (7', 22', 38')", mvp: true },
        { jornada: 'J06', rival: 'vs Imperio Rosa', score: '3 - 0 (G)', mins: "36'", highlight: '2 goles • Líder de goleo', mvp: true },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Valquirias', pj: 8, stat: '12 Goles • 2 Asistencias', badge: 'Líder Goleo' },
        { edition: '3.ª Edición', team: 'Valquirias', pj: 10, stat: '15 Goles', badge: 'Bota de Oro' },
      ],
    },
    {
      id: 7,
      shortLabel: 'Rayo #7 (Avatar Privacidad)',
      fullName: 'Alex "Rayo" Torres',
      initials: 'RT',
      dorsal: 7,
      team: 'Atlético Diversa',
      position: 'Defensa Central',
      pronouns: 'Elle / They',
      imageConsent: false,
      accentColor: '#8B5CF6',
      physical: { height: '1.73 m', age: '28 años', birth: '09 Sep 1998', foot: 'Derecho' },
      season4: { matchesMinutes: "8 / 295'", goals: 3, saves: 0, cards: '2 TA • 0 TR' },
      radar: { Ataque: 68, Fisico: 91, Velocidad: 86, Pase: 80, Regate: 72, Defensa: 95 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Sororas FC', score: '2 (4) - (5) 2 (P)', mins: "40'", highlight: '11 recuperaciones de balón', mvp: false },
        { jornada: 'J07', rival: 'vs Auroras', score: '2 - 1 (G)', mins: "40'", highlight: "Gol de cabeza al 36'", mvp: false },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Atlético Diversa', pj: 8, stat: '3 Goles • 4 Asistencias', badge: 'Muro Defensivo' },
        { edition: '3.ª Edición', team: 'Atlético Diversa', pj: 10, stat: '2 Goles • Capitana', badge: 'Defensa Ideal' },
      ],
    },
    {
      id: 15,
      shortLabel: 'Dani #15 (Avatar Privacidad)',
      fullName: 'Daniela "Dani" Pacheco',
      initials: 'DP',
      dorsal: 15,
      team: 'Atlético Diversa',
      position: 'Mediocampista',
      pronouns: 'Ella / She',
      imageConsent: false,
      accentColor: '#8B5CF6',
      physical: { height: '1.64 m', age: '24 años', birth: '28 Ene 2002', foot: 'Derecho' },
      season4: { matchesMinutes: "7 / 265'", goals: 2, saves: 0, cards: '1 TA • 0 TR' },
      radar: { Ataque: 76, Fisico: 80, Velocidad: 83, Pase: 87, Regate: 82, Defensa: 79 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Sororas FC', score: '2 (4) - (5) 2 (P)', mins: "40'", highlight: "1 asistencia al 14'", mvp: false },
        { jornada: 'J07', rival: 'vs Auroras', score: '2 - 1 (G)', mins: "40'", highlight: "1 gol de tiro libre (29')", mvp: true },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Atlético Diversa', pj: 7, stat: '2 Goles • 3 Asistencias', badge: 'Nuevo Ingreso' },
      ],
    },
  ];

  readonly partidos = signal<PartidoDominical[]>([
    {
      id: 1,
      round: 'Jornada 09',
      time: 'Dom 09:00 • Cancha 1',
      home: 'Queer Goals',
      away: 'Valquirias',
      status: 'PROGRAMADO',
      mvp: 'Duelo por el Liderato',
      timeline: [{ min: "00'", text: 'Cédula digital lista • 2 tiempos de 20 min sin empates' }],
    },
    {
      id: 2,
      round: 'Jornada 09',
      time: 'Dom 09:50 • Cancha 1',
      home: 'F.C. Lionesses',
      away: 'Lobas México',
      status: 'PROGRAMADO',
      mvp: 'Jornada Dominical CDMX',
      timeline: [{ min: "00'", text: 'Arbitraje oficial asignado • Inicio puntual 09:50 hrs' }],
    },
    {
      id: 3,
      round: 'Jornada 08',
      time: "Finalizado • 40'",
      home: 'Queer Goals',
      away: 'Good Vibes',
      status: 'FINALIZADO',
      score: '3 - 1',
      mvp: 'Val Ríos (Queer Goals)',
      timeline: [
        { min: "11'", text: 'Gol de Val Ríos (Queer Goals)' },
        { min: "20'", text: 'Fin del 1.er tiempo (20 min)' },
        { min: "26'", text: 'Gol de Meli Gómez (Good Vibes) — 1-1' },
        { min: "34'", text: 'Doblete de Val Ríos (Queer Goals)' },
        { min: "39'", text: 'Gol de Pau Cruz (Queer Goals) — 3-1 (+3 pts)' },
      ],
    },
    {
      id: 4,
      round: 'Jornada 08',
      time: 'Finalizado • Penales',
      home: 'Valquirias',
      away: 'F.C. Lionesses',
      status: 'FINALIZADO',
      score: '2 - 2',
      penalties: '(4) - (3)',
      mvp: 'Cami Mendoza (Valquirias)',
      timeline: [
        { min: "09'", text: 'Gol de Cami Mendoza (Valquirias)' },
        { min: "18'", text: 'Gol de Gaby Soto (F.C. Lionesses)' },
        { min: "31'", text: 'Gol de Andy Reyes (F.C. Lionesses)' },
        { min: "38'", text: 'Gol de Cami Mendoza (Valquirias) — 2-2' },
        { min: "40'", text: 'Tanda de Penales: Valquirias (4) - (3) F.C. Lionesses (+3 pts Valquirias)' },
      ],
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