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

  readonly equipos = signal<EquipoTabla[]>([]);
  readonly jugadorasBD = signal<any[]>([]);
  readonly partidos = signal<PartidoDominical[]>([]);
  readonly topGoleadoras = signal<any[]>([]);
  readonly topPorteras = signal<any[]>([]);
  readonly topAsistencias = signal<any[]>([]);
  readonly entrenamientos = signal<SesionEntrenamiento[]>([]);
  readonly conectadoMySQL = signal(false);

  readonly tablaOrdenada = computed(() =>
    [...this.equipos()].sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc)),
  );

  readonly top5Equipos = computed(() => this.tablaOrdenada().slice(0, 5));

  readonly proximosPartidos = computed(() =>
    this.partidos().filter((p) => p.status === 'PROGRAMADO'),
  );

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
        {
          jornada: 'J08',
          rival: 'vs Lobas México',
          score: '2 - 0 (G)',
          mins: "40'",
          highlight: '5 atajadas • Portería invicta',
          mvp: true,
        },
        {
          jornada: 'J07',
          rival: 'vs Queer Goals',
          score: '1 - 2 (P)',
          mins: "40'",
          highlight: '6 atajadas clave',
          mvp: false,
        },
        {
          jornada: 'J06',
          rival: 'vs Good Vibes',
          score: '3 - 1 (G)',
          mins: "40'",
          highlight: '4 atajadas en 2.º tiempo',
          mvp: false,
        },
      ],
      career: [
        {
          edition: '4.ª Edición (Actual)',
          team: 'F.C. Lionesses',
          pj: 8,
          stat: '36 Atajadas • 8 GC (1.00 prom)',
          badge: 'Líder Portería',
        },
        {
          edition: '3.ª Edición',
          team: 'F.C. Lionesses',
          pj: 11,
          stat: '48 Atajadas • Subcampeona',
          badge: 'Guante de Oro',
        },
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
        {
          jornada: 'J08',
          rival: 'vs Valquirias',
          score: '1 (4) - (3) 1 (G)',
          mins: "40'",
          highlight: "1 gol (18') + penal decisivo",
          mvp: true,
        },
        {
          jornada: 'J07',
          rival: 'vs F.C. Lionesses',
          score: '2 - 1 (G)',
          mins: "40'",
          highlight: '1 gol + MVP Jornada',
          mvp: true,
        },
      ],
      career: [
        {
          edition: '4.ª Edición (Actual)',
          team: 'Queer Goals',
          pj: 8,
          stat: '9 Goles • 3 Asistencias',
          badge: 'Goleadora del Club',
        },
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
        {
          jornada: 'J08',
          rival: 'vs Queer Goals',
          score: '1 (3) - (4) 1 (P)',
          mins: "40'",
          highlight: "1 gol al minuto 31'",
          mvp: false,
        },
        {
          jornada: 'J07',
          rival: 'vs Bandidas F.C.',
          score: '4 - 1 (G)',
          mins: "40'",
          highlight: "Hat-trick (7', 22', 38')",
          mvp: true,
        },
      ],
      career: [
        {
          edition: '4.ª Edición (Actual)',
          team: 'Valquirias',
          pj: 8,
          stat: '12 Goles • 2 Asistencias',
          badge: 'Líder Goleo',
        },
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
        {
          jornada: 'J08',
          rival: 'vs Unknown',
          score: '2 - 1 (G)',
          mins: "40'",
          highlight: '11 recuperaciones de balón',
          mvp: false,
        },
      ],
      career: [
        {
          edition: '4.ª Edición (Actual)',
          team: 'All Stars GV',
          pj: 8,
          stat: '3 Goles • 4 Asistencias',
          badge: 'Muro Defensivo',
        },
      ],
    },
  ];

  obtenerPerfilPorId(id: number): PerfilJugadoraFotMob {
    const existente = this.perfilesJugadoras.find((p) => p.id === id);
    if (existente) return existente;

    const rosters = this.rostersPorEquipo();
    for (const [teamIdStr, roster] of Object.entries(rosters)) {
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
          accentColor: esPortera
            ? '#3B82F6'
            : esDelantera
              ? '#F43F5E'
              : esMedia
                ? '#10B981'
                : '#8B5CF6',
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
}
