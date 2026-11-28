import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  proximoPartido?: {
    jornada: string;
    fechaHora: string;
    cancha: string;
    rival: string;
    local: boolean;
  };
  ultimosPartidos?: {
    jornada: string;
    rival: string;
    score: string;
    gano: boolean;
    nota?: string;
  }[];
  trofeos?: {
    torneo: string;
    anio: string;
    cantidad: number;
  }[];
  mejoresJugadoras?: {
    goleadora: { playerId: number; nombre: string; dorsal: number; goles: number };
    asistencias: { playerId: number; nombre: string; dorsal: number; asistencias: number };
  };
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
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  // Señales vacías: se llenan 100% desde MySQL al iniciar
  readonly equipos = signal<EquipoTabla[]>([]);
  readonly jugadorasBD = signal<any[]>([]);
  readonly partidos = signal<PartidoDominical[]>([]);
  readonly topGoleadoras = signal<any[]>([]);
  readonly topPorteras = signal<any[]>([]);
  readonly topAsistencias = signal<any[]>([]);
  readonly entrenamientos = signal<SesionEntrenamiento[]>([]);
  readonly conectadoMySQL = signal(false);

  // Tabla general ordenada por puntos y diferencia de goles desde SQL
  readonly tablaOrdenada = computed(() =>
    [...this.equipos()].sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc)),
  );

  readonly top5Equipos = computed(() => this.tablaOrdenada().slice(0, 5));

 
  readonly rostersPorEquipo: Record<number, JugadoraRosterPublica[]> = {
    1: [
      { playerId: 101, nick: 'Mariana López Hernández', dorsal: 1, position: 'Portera' },
      { playerId: 102, nick: 'Daniela Ramírez Cruz', dorsal: 2, position: 'Defensa' },
      { playerId: 103, nick: 'Fernanda Castillo Morales', dorsal: 3, position: 'Defensa' },
      { playerId: 104, nick: 'Andrea Sánchez Flores', dorsal: 4, position: 'Defensa' },
      { playerId: 105, nick: 'Paola Jiménez Torres', dorsal: 5, position: 'Defensa' },
      { playerId: 114, nick: 'Melissa Vargas León', dorsal: 14, position: 'Defensa' },
      { playerId: 106, nick: 'Valeria Mendoza Ruiz', dorsal: 6, position: 'Media' },
      { playerId: 107, nick: 'Karla Pérez García', dorsal: 7, position: 'Media' },
      { playerId: 108, nick: 'Alejandra Reyes Luna', dorsal: 8, position: 'Media' },
      { playerId: 110, nick: 'Gabriela Ortiz Vega', dorsal: 10, position: 'Media' },
      { playerId: 113, nick: 'Ximena Flores Castro', dorsal: 13, position: 'Media' },
      { playerId: 109, nick: 'Sofía Navarro Díaz', dorsal: 9, position: 'Delantera' },
      { playerId: 111, nick: 'Natalia Romero Silva', dorsal: 11, position: 'Delantera' },
      { playerId: 112, nick: 'Brenda Aguilar Ríos', dorsal: 12, position: 'Delantera' },
      { playerId: 115, nick: 'Regina Torres Méndez', dorsal: 15, position: 'Delantera' },
    ],
    2: [
      { playerId: 201, nick: 'Laura Martínez Silva', dorsal: 1, position: 'Portera' },
      { playerId: 202, nick: 'Mónica Herrera López', dorsal: 2, position: 'Defensa' },
      { playerId: 203, nick: 'Itzel García Romero', dorsal: 3, position: 'Defensa' },
      { playerId: 204, nick: 'Claudia Sánchez Rivas', dorsal: 4, position: 'Defensa' },
      { playerId: 205, nick: 'Jimena Morales Cruz', dorsal: 5, position: 'Defensa' },
      { playerId: 214, nick: 'Verónica Luna Ortiz', dorsal: 14, position: 'Defensa' },
      { playerId: 206, nick: 'Diana Flores Mendoza', dorsal: 6, position: 'Media' },
      { playerId: 207, nick: 'Renata Pérez Castillo', dorsal: 7, position: 'Media' },
      { playerId: 208, nick: 'Araceli Torres Jiménez', dorsal: 8, position: 'Media' },
      { playerId: 210, nick: 'Lucía Ramírez Vega', dorsal: 10, position: 'Media' },
      { playerId: 213, nick: 'Fátima Ríos Hernández', dorsal: 13, position: 'Media' },
      { playerId: 209, nick: 'Evelyn Reyes Navarro', dorsal: 9, position: 'Delantera' },
      { playerId: 211, nick: 'Abril Castro Díaz', dorsal: 11, position: 'Delantera' },
      { playerId: 212, nick: 'Karina León Aguilar', dorsal: 12, position: 'Delantera' },
      { playerId: 215, nick: 'Natalia Méndez Ruiz', dorsal: 15, position: 'Delantera' },
    ],
    3: [
      { playerId: 301, nick: 'Jessica Aguilar Torres', dorsal: 1, position: 'Portera' },
      { playerId: 302, nick: 'Fernanda López García', dorsal: 2, position: 'Defensa' },
      { playerId: 303, nick: 'Mariana Castillo Ruiz', dorsal: 3, position: 'Defensa' },
      { playerId: 304, nick: 'Daniela Romero Cruz', dorsal: 4, position: 'Defensa' },
      { playerId: 305, nick: 'Karla Sánchez Vega', dorsal: 5, position: 'Defensa' },
      { playerId: 314, nick: 'Evelyn Torres Hernández', dorsal: 14, position: 'Defensa' },
      { playerId: 306, nick: 'Valeria Martínez Flores', dorsal: 6, position: 'Media' },
      { playerId: 307, nick: 'Alejandra Mendoza Díaz', dorsal: 7, position: 'Media' },
      { playerId: 308, nick: 'Ximena Ramírez Ortiz', dorsal: 8, position: 'Media' },
      { playerId: 310, nick: 'Natalia Herrera Silva', dorsal: 10, position: 'Media' },
      { playerId: 313, nick: 'Lucía Pérez Morales', dorsal: 13, position: 'Media' },
      { playerId: 309, nick: 'Paola Reyes Luna', dorsal: 9, position: 'Delantera' },
      { playerId: 311, nick: 'Regina Jiménez Ríos', dorsal: 11, position: 'Delantera' },
      { playerId: 312, nick: 'Gabriela Navarro León', dorsal: 12, position: 'Delantera' },
      { playerId: 315, nick: 'Mónica Flores Castro', dorsal: 15, position: 'Delantera' },
    ],
    4: [
      { playerId: 401, nick: 'Alejandra Sánchez López', dorsal: 1, position: 'Portera' },
      { playerId: 402, nick: 'Blanca Andrade Pérez', dorsal: 2, position: 'Defensa' },
      { playerId: 403, nick: 'Carolina Jiménez Ríos', dorsal: 3, position: 'Defensa' },
      { playerId: 404, nick: 'Jessica Morales Vega', dorsal: 4, position: 'Defensa' },
      { playerId: 405, nick: 'Paulina Castro Ruiz', dorsal: 5, position: 'Defensa' },
      { playerId: 414, nick: 'Sofía Herrera Méndez', dorsal: 14, position: 'Defensa' },
      { playerId: 406, nick: 'Mariana Torres Flores', dorsal: 6, position: 'Media' },
      { playerId: 407, nick: 'Andrea Navarro Cruz', dorsal: 7, position: 'Media' },
      { playerId: 408, nick: 'Leslie Ramírez García', dorsal: 8, position: 'Media' },
      { playerId: 410, nick: 'Gabriela Mendoza Silva', dorsal: 10, position: 'Media' },
      { playerId: 413, nick: 'Fernanda Aguilar León', dorsal: 13, position: 'Media' },
      { playerId: 409, nick: 'Valentina Romero Díaz', dorsal: 9, position: 'Delantera' },
      { playerId: 411, nick: 'Michelle Reyes Hernández', dorsal: 11, position: 'Delantera' },
      { playerId: 412, nick: 'Brenda Ortiz Luna', dorsal: 12, position: 'Delantera' },
      { playerId: 415, nick: 'Natalia Castillo Rivas', dorsal: 15, position: 'Delantera' },
    ],
    5: [
      { playerId: 501, nick: 'Thalia Aguilera González', dorsal: 1, position: 'Portera' },
      { playerId: 502, nick: 'Olivia Pineda Martínez', dorsal: 2, position: 'Defensa' },
      { playerId: 503, nick: 'Britani García López', dorsal: 3, position: 'Defensa' },
      { playerId: 504, nick: 'Mariana Sánchez Cruz', dorsal: 4, position: 'Defensa' },
      { playerId: 505, nick: 'Fernanda Reyes Flores', dorsal: 5, position: 'Defensa' },
      { playerId: 514, nick: 'Lucía Pérez Castro', dorsal: 14, position: 'Defensa' },
      { playerId: 506, nick: 'Valeria Torres Mendoza', dorsal: 6, position: 'Media' },
      { playerId: 507, nick: 'Karla Jiménez Ruiz', dorsal: 7, position: 'Media' },
      { playerId: 508, nick: 'Andrea Ramírez Silva', dorsal: 8, position: 'Media' },
      { playerId: 510, nick: 'Daniela Navarro Ortiz', dorsal: 10, position: 'Media' },
      { playerId: 513, nick: 'Gabriela Flores Ríos', dorsal: 13, position: 'Media' },
      { playerId: 509, nick: 'Regina Castillo Vega', dorsal: 9, position: 'Delantera' },
      { playerId: 511, nick: 'Paola Herrera Díaz', dorsal: 11, position: 'Delantera' },
      { playerId: 512, nick: 'Ximena Morales León', dorsal: 12, position: 'Delantera' },
      { playerId: 515, nick: 'Natalia Romero Luna', dorsal: 15, position: 'Delantera' },
    ],
    6: [
      { playerId: 601, nick: 'Daniela Flores Martínez', dorsal: 1, position: 'Portera' },
      { playerId: 602, nick: 'Paola Ramírez López', dorsal: 2, position: 'Defensa' },
      { playerId: 603, nick: 'Karla Mendoza Cruz', dorsal: 3, position: 'Defensa' },
      { playerId: 604, nick: 'Ingrid Santana Moya', dorsal: 4, position: 'Defensa' },
      { playerId: 605, nick: 'Ximena Torres García', dorsal: 5, position: 'Defensa' },
      { playerId: 614, nick: 'Diana Romero Flores', dorsal: 14, position: 'Defensa' },
      { playerId: 606, nick: 'Melissa Jiménez Ríos', dorsal: 6, position: 'Media' },
      { playerId: 607, nick: 'Mariana Reyes Silva', dorsal: 7, position: 'Media' },
      { playerId: 608, nick: 'Regina Navarro Pérez', dorsal: 8, position: 'Media' },
      { playerId: 610, nick: 'Andrea Castillo Vega', dorsal: 10, position: 'Media' },
      { playerId: 613, nick: 'Lucía Herrera Díaz', dorsal: 13, position: 'Media' },
      { playerId: 609, nick: 'Valeria Ortiz Hernández', dorsal: 9, position: 'Delantera' },
      { playerId: 611, nick: 'Sofía León Morales', dorsal: 11, position: 'Delantera' },
      { playerId: 612, nick: 'Fernanda Aguilar Ruiz', dorsal: 12, position: 'Delantera' },
      { playerId: 615, nick: 'Natalia Sánchez Luna', dorsal: 15, position: 'Delantera' },
    ],
    7: [
      { playerId: 701, nick: 'Renata Flores Martínez', dorsal: 1, position: 'Portera' },
      { playerId: 702, nick: 'Alejandra Cruz López', dorsal: 2, position: 'Defensa' },
      { playerId: 703, nick: 'Karina Ríos Hernández', dorsal: 3, position: 'Defensa' },
      { playerId: 704, nick: 'Daniela Vega Torres', dorsal: 4, position: 'Defensa' },
      { playerId: 705, nick: 'Fernanda Silva Morales', dorsal: 5, position: 'Defensa' },
      { playerId: 714, nick: 'Sofía Torres Aguilar', dorsal: 14, position: 'Defensa' },
      { playerId: 706, nick: 'Valeria Ortiz Ramírez', dorsal: 6, position: 'Media' },
      { playerId: 707, nick: 'Mariana León García', dorsal: 7, position: 'Media' },
      { playerId: 708, nick: 'Andrea Luna Pérez', dorsal: 8, position: 'Media' },
      { playerId: 710, nick: 'Melissa Castro Jiménez', dorsal: 10, position: 'Media' },
      { playerId: 713, nick: 'Claudia Reyes Navarro', dorsal: 13, position: 'Media' },
      { playerId: 709, nick: 'Paola Díaz Romero', dorsal: 9, position: 'Delantera' },
      { playerId: 711, nick: 'Natalia Flores Sánchez', dorsal: 11, position: 'Delantera' },
      { playerId: 712, nick: 'Jimena Herrera Mendoza', dorsal: 12, position: 'Delantera' },
      { playerId: 715, nick: 'Evelyn Martínez Ruiz', dorsal: 15, position: 'Delantera' },
    ],
    8: [
      { playerId: 801, nick: 'Andrea Morales Ríos', dorsal: 1, position: 'Portera' },
      { playerId: 802, nick: 'Esmeralda Sosa Martínez', dorsal: 2, position: 'Defensa' },
      { playerId: 803, nick: 'Paulina García López', dorsal: 3, position: 'Defensa' },
      { playerId: 804, nick: 'Diana Reyes Cruz', dorsal: 4, position: 'Defensa' },
      { playerId: 805, nick: 'Jimena Navarro Vega', dorsal: 5, position: 'Defensa' },
      { playerId: 814, nick: 'Claudia Romero Castro', dorsal: 14, position: 'Defensa' },
      { playerId: 806, nick: 'Karina Torres Silva', dorsal: 6, position: 'Media' },
      { playerId: 807, nick: 'Fernanda Castillo Ruiz', dorsal: 7, position: 'Media' },
      { playerId: 808, nick: 'Valeria Mendoza Flores', dorsal: 8, position: 'Media' },
      { playerId: 810, nick: 'Brenda Ramírez Díaz', dorsal: 10, position: 'Media' },
      { playerId: 813, nick: 'Melissa Jiménez Luna', dorsal: 13, position: 'Media' },
      { playerId: 809, nick: 'Sofía Aguilar Hernández', dorsal: 9, position: 'Delantera' },
      { playerId: 811, nick: 'Mariana Pérez León', dorsal: 11, position: 'Delantera' },
      { playerId: 812, nick: 'Regina Herrera Ortiz', dorsal: 12, position: 'Delantera' },
      { playerId: 815, nick: 'Natalia Sánchez Méndez', dorsal: 15, position: 'Delantera' },
    ],
    9: [
      { playerId: 901, nick: 'Gabriela Martínez Cruz', dorsal: 1, position: 'Portera' },
      { playerId: 902, nick: 'Fernanda López Ríos', dorsal: 2, position: 'Defensa' },
      { playerId: 903, nick: 'Alejandra Torres Silva', dorsal: 3, position: 'Defensa' },
      { playerId: 904, nick: 'Daniela Pérez Mendoza', dorsal: 4, position: 'Defensa' },
      { playerId: 905, nick: 'Karina Romero Vega', dorsal: 5, position: 'Defensa' },
      { playerId: 914, nick: 'Evelyn Ríos Jiménez', dorsal: 14, position: 'Defensa' },
      { playerId: 906, nick: 'Valeria Sánchez Ruiz', dorsal: 6, position: 'Media' },
      { playerId: 907, nick: 'Mónica Castillo Flores', dorsal: 7, position: 'Media' },
      { playerId: 908, nick: 'Itzel Navarro Hernández', dorsal: 8, position: 'Media' },
      { playerId: 910, nick: 'Paola Aguilar Díaz', dorsal: 10, position: 'Media' },
      { playerId: 913, nick: 'Laura Méndez Castro', dorsal: 13, position: 'Media' },
      { playerId: 909, nick: 'Regina Morales León', dorsal: 9, position: 'Delantera' },
      { playerId: 911, nick: 'Jimena Reyes Ortiz', dorsal: 11, position: 'Delantera' },
      { playerId: 912, nick: 'Andrea García Luna', dorsal: 12, position: 'Delantera' },
      { playerId: 915, nick: 'Ximena Herrera Ramírez', dorsal: 15, position: 'Delantera' },
    ],
    10: [
      { playerId: 1001, nick: 'Claudia Ramírez Flores', dorsal: 1, position: 'Portera' },
      { playerId: 1002, nick: 'Natalia Pérez López', dorsal: 2, position: 'Defensa' },
      { playerId: 1003, nick: 'Melissa Torres Cruz', dorsal: 3, position: 'Defensa' },
      { playerId: 1004, nick: 'Diana Sánchez Vega', dorsal: 4, position: 'Defensa' },
      { playerId: 1005, nick: 'Abril Mendoza Ruiz', dorsal: 5, position: 'Defensa' },
      { playerId: 1014, nick: 'Andrea Flores Castro', dorsal: 14, position: 'Defensa' },
      { playerId: 1006, nick: 'Valentina García Ríos', dorsal: 6, position: 'Media' },
      { playerId: 1007, nick: 'Jessica Navarro Silva', dorsal: 7, position: 'Media' },
      { playerId: 1008, nick: 'Fátima Romero Díaz', dorsal: 8, position: 'Media' },
      { playerId: 1010, nick: 'Mariana Ortiz Hernández', dorsal: 10, position: 'Media' },
      { playerId: 1013, nick: 'Sofía Jiménez Luna', dorsal: 13, position: 'Media' },
      { playerId: 1009, nick: 'Karla Castillo Morales', dorsal: 9, position: 'Delantera' },
      { playerId: 1011, nick: 'Paola Herrera León', dorsal: 11, position: 'Delantera' },
      { playerId: 1012, nick: 'Renata Aguilar Méndez', dorsal: 12, position: 'Delantera' },
      { playerId: 1015, nick: 'Verónica Reyes Martínez', dorsal: 15, position: 'Delantera' },
    ],
    11: [
      { playerId: 1101, nick: 'Sofía Gallegos Hernández', dorsal: 1, position: 'Portera' },
      { playerId: 1102, nick: 'Debora Gallegos Ruiz', dorsal: 2, position: 'Defensa' },
      { playerId: 1103, nick: 'Valeria Martínez Cruz', dorsal: 3, position: 'Defensa' },
      { playerId: 1104, nick: 'Mariana López Vega', dorsal: 4, position: 'Defensa' },
      { playerId: 1105, nick: 'Fernanda Torres Silva', dorsal: 5, position: 'Defensa' },
      { playerId: 1114, nick: 'Lucía Aguilar Pérez', dorsal: 14, position: 'Defensa' },
      { playerId: 1106, nick: 'Daniela Castillo Ríos', dorsal: 6, position: 'Media' },
      { playerId: 1107, nick: 'Andrea Reyes Flores', dorsal: 7, position: 'Media' },
      { playerId: 1108, nick: 'Paola Navarro Díaz', dorsal: 8, position: 'Media' },
      { playerId: 1110, nick: 'Karla Jiménez Morales', dorsal: 10, position: 'Media' },
      { playerId: 1113, nick: 'Melissa Ramírez Castro', dorsal: 13, position: 'Media' },
      { playerId: 1109, nick: 'Ximena Mendoza León', dorsal: 9, position: 'Delantera' },
      { playerId: 1111, nick: 'Regina Sánchez Ortiz', dorsal: 11, position: 'Delantera' },
      { playerId: 1112, nick: 'Gabriela Herrera Luna', dorsal: 12, position: 'Delantera' },
      { playerId: 1115, nick: 'Natalia Romero García', dorsal: 15, position: 'Delantera' },
    ],
  };

  readonly jugadorasMvp = signal<JugadoraMvp[]>([
    {
      id: 110,
      badge: 'Jugadora de la Jornada',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      initials: 'GO',
      name: 'Gabriela Ortiz Vega',
      team: 'Queer Goals',
      position: 'Media',
      pronouns: 'Ella / She',
      dorsal: 10,
      statsLine: "8 PJ • 310' • 6 Goles • 6 Asist",
    },
    {
      id: 209,
      badge: 'Goleadora',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      initials: 'ER',
      name: 'Evelyn Reyes Navarro',
      team: 'Valquirias',
      position: 'Delantera',
      pronouns: 'Elle / They',
      dorsal: 9,
      statsLine: "8 PJ • 320' • 12 Goles • 2 Asist",
    },
    {
      id: 301,
      badge: 'Mejor Portera',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      initials: 'JA',
      name: 'Jessica Aguilar Torres',
      team: 'F.C. Lionesses',
      position: 'Portera',
      pronouns: 'Ella / She',
      dorsal: 1,
      statsLine: "8 PJ • 320' • 36 Atajadas",
    },
    {
      id: 604,
      badge: 'Muro Defensivo',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      initials: 'IS',
      name: 'Ingrid Santana Moya',
      team: 'All Stars GV',
      position: 'Defensa',
      pronouns: 'Elle / They',
      dorsal: 4,
      statsLine: "8 PJ • 295' • 3 Goles • 4 Asist",
    },
  ]);

  readonly topGoleadoras = [
    { rank: 1, playerId: 209, name: 'Evelyn Reyes', team: 'Valquirias', goals: 12 },
    { rank: 2, playerId: 109, name: 'Sofía Navarro', team: 'Queer Goals', goals: 9 },
    { rank: 3, playerId: 309, name: 'Paola Reyes', team: 'F.C. Lionesses', goals: 8 },
  ];

  readonly topPorteras = [
    { rank: 1, playerId: 301, name: 'Jessica Aguilar', team: 'F.C. Lionesses', stat: '36 / 8' },
    { rank: 2, playerId: 101, name: 'Mariana López', team: 'Queer Goals', stat: '31 / 7' },
    { rank: 4, playerId: 201, name: 'Laura Martínez', team: 'Valquirias', stat: '25 / 9' },
  ];

  readonly perfilesJugadoras: PerfilJugadoraFotMob[] = [
    {
      id: 301,
      shortLabel: 'Jessica #1 (F.C. Lionesses)',
      fullName: 'Jessica Aguilar Torres',
      initials: 'JA',
      dorsal: 1,
      team: 'F.C. Lionesses',
      position: 'Portera',
      pronouns: 'Ella / She',
      imageConsent: true,
      accentColor: '#3B82F6',
      physical: { height: '1.75 m', age: '29 años', birth: '19 Nov 1997', foot: 'Izquierdo' },
      season4: { matchesMinutes: "8 / 320'", goals: 0, saves: 36, cards: '0 TA • 0 TR' },
      radar: { Ataque: 42, Fisico: 86, Velocidad: 78, Pase: 81, Regate: 64, Defensa: 94 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Lobas México', score: '2 - 0 (G)', mins: "40'", highlight: '5 atajadas • Portería invicta', mvp: true },
        { jornada: 'J07', rival: 'vs Queer Goals', score: '1 - 2 (P)', mins: "40'", highlight: '6 atajadas clave', mvp: false },
        { jornada: 'J06', rival: 'vs Good Vibes', score: '3 - 1 (G)', mins: "40'", highlight: '4 atajadas en 2.º tiempo', mvp: false },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'F.C. Lionesses', pj: 8, stat: '36 Atajadas • 8 GC (1.00 prom)', badge: 'Líder Portería' },
        { edition: '3.ª Edición', team: 'F.C. Lionesses', pj: 11, stat: '48 Atajadas • Subcampeona', badge: 'Guante de Oro' },
      ],
    },
    {
      id: 109,
      shortLabel: 'Sofía #9 (Queer Goals)',
      fullName: 'Sofía Navarro Díaz',
      initials: 'SN',
      dorsal: 9,
      team: 'Queer Goals',
      position: 'Delantera',
      pronouns: 'Ella / She',
      imageConsent: true,
      accentColor: '#10B981',
      physical: { height: '1.68 m', age: '21 años', birth: '04 Mar 2005', foot: 'Derecho' },
      season4: { matchesMinutes: "8 / 310'", goals: 9, saves: 0, cards: '1 TA • 0 TR' },
      radar: { Ataque: 91, Fisico: 82, Velocidad: 89, Pase: 85, Regate: 93, Defensa: 64 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Valquirias', score: '1 (4) - (3) 1 (G)', mins: "40'", highlight: "1 gol (18') + penal decisivo", mvp: true },
        { jornada: 'J07', rival: 'vs F.C. Lionesses', score: '2 - 1 (G)', mins: "40'", highlight: '1 gol + MVP Jornada', mvp: true },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Queer Goals', pj: 8, stat: '9 Goles • 3 Asistencias', badge: 'Goleadora del Club' },
      ],
    },
    {
      id: 209,
      shortLabel: 'Evelyn #9 (Valquirias)',
      fullName: 'Evelyn Reyes Navarro',
      initials: 'ER',
      dorsal: 9,
      team: 'Valquirias',
      position: 'Delantera',
      pronouns: 'Elle / They',
      imageConsent: true,
      accentColor: '#F43F5E',
      physical: { height: '1.71 m', age: '29 años', birth: '12 Ago 1997', foot: 'Ambidiestro' },
      season4: { matchesMinutes: "8 / 320'", goals: 12, saves: 0, cards: '0 TA • 0 TR' },
      radar: { Ataque: 96, Fisico: 85, Velocidad: 92, Pase: 79, Regate: 88, Defensa: 52 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Queer Goals', score: '1 (3) - (4) 1 (P)', mins: "40'", highlight: "1 gol al minuto 31'", mvp: false },
        { jornada: 'J07', rival: 'vs Bandidas F.C.', score: '4 - 1 (G)', mins: "40'", highlight: "Hat-trick (7', 22', 38')", mvp: true },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'Valquirias', pj: 8, stat: '12 Goles • 2 Asistencias', badge: 'Líder Goleo' },
      ],
    },
    {
      id: 604,
      shortLabel: 'Ingrid #4 (Avatar Privacidad)',
      fullName: 'Ingrid Santana Moya',
      initials: 'IS',
      dorsal: 4,
      team: 'All Stars GV',
      position: 'Defensa',
      pronouns: 'Elle / They',
      imageConsent: false,
      accentColor: '#8B5CF6',
      physical: { height: '1.73 m', age: '27 años', birth: '09 Sep 1999', foot: 'Derecho' },
      season4: { matchesMinutes: "8 / 295'", goals: 3, saves: 0, cards: '2 TA • 0 TR' },
      radar: { Ataque: 68, Fisico: 91, Velocidad: 86, Pase: 80, Regate: 72, Defensa: 95 },
      recentMatches: [
        { jornada: 'J08', rival: 'vs Unknown', score: '2 - 1 (G)', mins: "40'", highlight: '11 recuperaciones de balón', mvp: false },
      ],
      career: [
        { edition: '4.ª Edición (Actual)', team: 'All Stars GV', pj: 8, stat: '3 Goles • 4 Asistencias', badge: 'Muro Defensivo' },
      ],
    },
  ];

  // Busca o construye dinámicamente el perfil de cualquiera de las 165 jugadoras del padrón
  obtenerPerfilPorId(id: number): PerfilJugadoraFotMob {
    const existente = this.perfilesJugadoras.find((p) => p.id === id);
    if (existente) return existente;

    for (const [teamIdStr, roster] of Object.entries(this.rostersPorEquipo)) {
      const jugadora = roster.find((j) => j.playerId === id);
      if (jugadora) {
        const equipo = this.equipos().find((e) => e.id === Number(teamIdStr));
        const partes = jugadora.nick.split(' ');
        const initials = ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase();
        const esPortera = jugadora.position === 'Portera';
        const esDelantera = jugadora.position === 'Delantera';
        const esMedia = jugadora.position === 'Media';

        return {
          id: jugadora.playerId,
          shortLabel: `${partes[0]} #${jugadora.dorsal}`,
          fullName: jugadora.nick,
          initials,
          dorsal: jugadora.dorsal,
          team: equipo?.name ?? 'Liga Mujeres Diversas',
          position: jugadora.position,
          pronouns: 'Ella / She',
          imageConsent: jugadora.dorsal % 2 === 1,
          accentColor: esPortera ? '#3B82F6' : esDelantera ? '#F43F5E' : esMedia ? '#10B981' : '#8B5CF6',
          physical: { height: '1.67 m', age: '26 años', birth: '15 May 2000', foot: 'Derecho' },
          season4: {
            matchesMinutes: "7 / 260'",
            goals: esDelantera ? 4 : esMedia ? 2 : 0,
            saves: esPortera ? 24 : 0,
            cards: '1 TA • 0 TR',
          },
          radar: {
            Ataque: esDelantera ? 88 : esMedia ? 80 : 58,
            Fisico: 83,
            Velocidad: esDelantera ? 87 : 81,
            Pase: esMedia ? 89 : 78,
            Regate: esDelantera || esMedia ? 85 : 70,
            Defensa: esPortera || jugadora.position === 'Defensa' ? 91 : 62,
          },
          recentMatches: [
            {
              jornada: 'J08',
              rival: `Jornada Oficial • ${equipo?.name ?? ''}`,
              score: '40 min',
              mins: "40'",
              highlight: 'Participación titular en cédula oficial',
              mvp: false,
            },
          ],
          career: [
            {
              edition: '4.ª Edición (Actual)',
              team: equipo?.name ?? 'Liga Mujeres Diversas',
              pj: 7,
              stat: `${jugadora.position} • Dorsal #${jugadora.dorsal}`,
              badge: 'Plantilla Oficial',
            },
          ],
        };
      }
    }

    return this.perfilesJugadoras[0];
  }

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
      timeline: [
        { min: '', text: 'Gol de Sofía Navarro Díaz (Queer Goals)' },
        { min: '', text: 'Gol de Valentina Romero Díaz (Good Vibes)' },
        { min: '', text: 'Gol de Sofía Navarro Díaz (Queer Goals)' },
        { min: '', text: 'Gol de Natalia Romero Silva (Queer Goals)' },
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
      penalties: 'Penales: Valquirias (4) - (3) F.C. Lionesses',
      timeline: [
        { min: '', text: 'Gol de Evelyn Reyes Navarro (Valquirias)' },
        { min: '', text: 'Gol de Paola Reyes Luna (F.C. Lionesses)' },
        { min: '', text: 'Gol de Regina Jiménez Ríos (F.C. Lionesses)' },
        { min: '', text: 'Gol de Evelyn Reyes Navarro (Valquirias)' },
      ],
    },
  ]);

  readonly proximosPartidos = computed(() =>
    this.partidos().filter((p) => p.status === 'PROGRAMADO'),
  );

  // Ciclo automático: agrupa las jugadoras de MySQL por su equipo_id
  readonly rostersPorEquipo = computed<Record<number, JugadoraRosterPublica[]>>(() => {
    const mapa: Record<number, JugadoraRosterPublica[]> = {};

    for (const j of this.jugadorasBD()) {
      const eqId = Number(j.equipo_id);
      if (!mapa[eqId]) {
        mapa[eqId] = [];
      }
      mapa[eqId].push({
        playerId: Number(j.id),
        nick: j.nombre,
        dorsal: Number(j.dorsal),
        position: j.posicion || 'Media',
      });
    }

    return mapa;
  });

  // MVPs generadas dinámicamente desde las jugadoras de MySQL
  readonly jugadorasMvp = computed<JugadoraMvp[]>(() => {
    return this.jugadorasBD()
      .slice(0, 4)
      .map((j, idx) => {
        const badges = [
          {
            badge: 'Jugadora de la Jornada',
            color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          },
          {
            badge: 'Goleadora',
            color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
          },
          {
            badge: 'Mejor Portera',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          },
          {
            badge: 'Muro Defensivo',
            color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
          },
        ];
        const b = badges[idx % badges.length];
        const iniciales = (j.nombre || 'JG')
          .split(' ')
          .slice(0, 2)
          .map((n: string) => n[0])
          .join('')
          .toUpperCase();

        return {
          id: Number(j.id),
          badge: b.badge,
          badgeColor: b.color,
          initials: iniciales,
          name: j.nombre,
          team: j.equipo_nombre || 'Liga Mujeres Diversas',
          position: j.posicion || 'Media',
          pronouns: j.pronombres || 'Ella / She',
          dorsal: Number(j.dorsal),
          statsLine: `Dorsal #${j.dorsal} • ${j.posicion || 'Jugadora'}`,
        };
      });
  });

  constructor() {
    queueMicrotask(() => {
      this.sincronizarConMySQL();
    });
  }

  async sincronizarConMySQL(): Promise<void> {
    try {
      const [equiposRes, jugadorasRes, partidosRes, rankingsRes] = await Promise.allSettled([
        firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/equipos`)),
        firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/jugadoras`)),
        firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/partidos`)),
        firstValueFrom(this.http.get<any>(`${this.apiUrl}/rankings`)),
      ]);

      const equiposApi = equiposRes.status === 'fulfilled' ? equiposRes.value : [];
      const jugadorasApi = jugadorasRes.status === 'fulfilled' ? jugadorasRes.value : [];
      const listaPartidos = partidosRes.status === 'fulfilled' ? partidosRes.value : [];
      const rankingsApi = rankingsRes.status === 'fulfilled' ? rankingsRes.value : {};

      this.partidos.set(listaPartidos);
      this.jugadorasBD.set(jugadorasApi || []);

      this.equipos.set(
        (equiposApi || []).map((eq) => {
          const nombreEq = (eq.name || '').trim().toUpperCase();

          const partidosEquipo = listaPartidos.filter(
            (p: any) =>
              (p.home || '').trim().toUpperCase() === nombreEq ||
              (p.away || '').trim().toUpperCase() === nombreEq,
          );

          const sig = partidosEquipo.find((p: any) => p.status === 'PROGRAMADO');
          const proximoPartido = sig
            ? {
                jornada: sig.round || 'Jornada 09',
                fechaHora: sig.time || 'Dom 09:00',
                cancha: 'Cancha 1',
                rival: (sig.home || '').trim().toUpperCase() === nombreEq ? sig.away : sig.home,
                local: (sig.home || '').trim().toUpperCase() === nombreEq,
              }
            : undefined;

          const ultimosPartidos = partidosEquipo
            .filter((p: any) => p.status === 'FINALIZADO')
            .slice(0, 5)
            .map((p: any) => {
              const esLocal = (p.home || '').trim().toUpperCase() === nombreEq;
              const rival = esLocal ? p.away : p.home;
              const partes = (p.score || '0 - 0').split('-').map((n: string) => Number(n.trim()));
              const golesPropios = esLocal ? partes[0] : partes[1];
              const golesRival = esLocal ? partes[1] : partes[0];

              return {
                jornada: p.round || 'Jornada',
                rival,
                score: p.score || '0 - 0',
                gano: golesPropios > golesRival,
                nota: p.penalties || undefined,
              };
            });

          return {
            id: Number(eq.id),
            abbr: eq.abbr,
            name: eq.name,
            pj: Number(eq.pj ?? 0),
            pg: Number(eq.pg ?? 0),
            pp: Number(eq.pp ?? 0),
            gf: Number(eq.gf ?? 0),
            gc: Number(eq.gc ?? 0),
            pts: Number(eq.pts ?? 0),
            color: eq.color || 'bg-purple-600',
            proximoPartido,
            ultimosPartidos,
          };
        }),
      );

      this.topGoleadoras.set(
        (rankingsApi?.goleadoras || []).map((g: any, i: number) => ({ rank: i + 1, ...g })),
      );
      this.topPorteras.set(
        (rankingsApi?.porteras || []).map((p: any, i: number) => ({
          rank: i + 1,
          playerId: p.playerId,
          name: p.name,
          team: p.team,
          stat: `${p.atajadas} ataj.`,
        })),
      );
      this.topAsistencias.set(
        (rankingsApi?.asistencias || []).map((a: any, i: number) => ({ rank: i + 1, ...a })),
      );

      this.conectadoMySQL.set(equiposRes.status === 'fulfilled');
    } catch (error) {
      console.error('Error conectando con MySQL:', error);
      this.conectadoMySQL.set(false);
    }
  }
  // Perfil dinámico buscado por ID real en jugadorasBD de MySQL
  obtenerPerfilPorId(id: number): PerfilJugadoraFotMob {
    return this.obtenerPerfilJugadora(id);
  }

  obtenerPerfilJugadora(id: number): PerfilJugadoraFotMob {
    const j =
      this.jugadorasBD().find((item) => Number(item.id) === Number(id)) || this.jugadorasBD()[0];

    if (!j) {
      return {
        id,
        shortLabel: 'Cargando...',
        fullName: 'Cargando desde MySQL...',
        initials: 'LM',
        dorsal: 0,
        team: 'Liga Mujeres Diversas',
        position: 'Jugadora',
        pronouns: 'Ella / She',
        imageConsent: true,
        accentColor: '#9333ea',
        physical: { height: '-', age: '-', birth: '-', foot: '-' },
        season4: { matchesMinutes: "0 / 0'", goals: 0, saves: 0, cards: '0 / 0' },
        radar: { Ataque: 75, Fisico: 75, Velocidad: 75, Pase: 75, Regate: 75, Defensa: 75 },
        recentMatches: [],
        career: [],
      };
    }

    const iniciales = (j.nombre || 'JG')
      .split(' ')
      .slice(0, 2)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

    return {
      id: Number(j.id),
      shortLabel: `${j.nombre.split(' ')[0]} (#${j.dorsal})`,
      fullName: j.nombre,
      initials: iniciales,
      dorsal: Number(j.dorsal),
      team: j.equipo_nombre || 'Liga Mujeres Diversas',
      position: j.posicion || 'Jugadora',
      pronouns: (j.pronombres as any) || 'Ella / She',
      imageConsent: Boolean(j.consentimiento_imagen ?? true),
      accentColor: '#9333ea',
      physical: {
        height: j.estatura || '1.68 m',
        age: j.edad ? `${j.edad} años` : '26 años',
        birth: j.fecha_nacimiento || '-',
        foot: j.pie_habil || 'Derecho',
      },
      season4: {
        matchesMinutes: `${j.pj ?? 0} / ${j.minutos ?? 0}'`,
        goals: Number(j.goles ?? 0),
        saves: Number(j.atajadas ?? 0),
        cards: `${j.amarillas ?? 0} / ${j.rojas ?? 0}`,
      },
      radar: {
        Ataque: Number(j.stat_ataque ?? 78),
        Fisico: Number(j.stat_fisico ?? 80),
        Velocidad: Number(j.stat_velocidad ?? 82),
        Pase: Number(j.stat_pase ?? 81),
        Regate: Number(j.stat_regate ?? 79),
        Defensa: Number(j.stat_defensa ?? 76),
      },
      recentMatches: [],
      career: [
        {
          edition: '4.ª Edición (2026)',
          team: j.equipo_nombre || 'Liga Mujeres Diversas',
          pj: Number(j.pj ?? 0),
          stat: `${j.goles ?? 0} Goles`,
          badge: 'MySQL ID #' + j.id,
        },
      ],
    };
  }

  // Guarda el partido en MySQL y recarga la tabla general
  async registrarPartido(nuevo: Omit<PartidoDominical, 'id'>): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiUrl}/partidos`, nuevo));
    await this.sincronizarConMySQL();
  }
}
