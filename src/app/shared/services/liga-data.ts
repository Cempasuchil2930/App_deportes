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
      const partidosApi = partidosRes.status === 'fulfilled' ? partidosRes.value : [];
      const rankingsApi = rankingsRes.status === 'fulfilled' ? rankingsRes.value : {};

      // Carga directa desde tabla equipos (por id)
      this.equipos.set(
        (equiposApi || []).map((eq) => ({
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
        })),
      );

      // Carga directa desde tabla jugadoras (por id)
      this.jugadorasBD.set(jugadorasApi || []);

      // Carga directa desde tabla partidos (por id)
      this.partidos.set(partidosApi || []);

      // Carga directa desde estadisticas_partido
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
