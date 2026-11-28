import { Injectable, signal } from '@angular/core';

export interface SolicitudEquipo {
  id: number;
  nombreEquipo: string;
  colorDistintivo: string;
  abreviatura: string;
  capitana: string;
  correo: string;
  apodo?: string;
  dorsal: number;
  posicion: string;
  pronombres: string;
  fotoAutorizada: boolean;
  estatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
}

const STORAGE_KEY = 'md_solicitudes_equipos_v1';

const SOLICITUDES_INICIALES: SolicitudEquipo[] = [
  {
    id: 1,
    nombreEquipo: 'Fénix F.C. (FNX)',
    colorDistintivo: 'Naranja / Negro',
    abreviatura: 'FNX',
    capitana: 'Valeria Ríos',
    correo: 'val.rios@queergoals.mx',
    dorsal: 10,
    posicion: 'Media',
    pronombres: 'Ella',
    fotoAutorizada: true,
    estatus: 'PENDIENTE',
  },
  {
    id: 2,
    nombreEquipo: 'Valquirias United (VQD)',
    colorDistintivo: 'Morado / Blanco',
    abreviatura: 'VQD',
    capitana: 'Sofía Mendoza',
    correo: 'sofia.m@valquirias.mx',
    dorsal: 9,
    posicion: 'Delantera',
    pronombres: 'Ella',
    fotoAutorizada: true,
    estatus: 'APROBADO',
  },
];

@Injectable({
  providedIn: 'root',
})
export class SolicitudesEquiposService {
  readonly solicitudes = signal<SolicitudEquipo[]>(this.cargarDesdeStorage());

  private cargarDesdeStorage(): SolicitudEquipo[] {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        return JSON.parse(guardado);
      }
    } catch {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SOLICITUDES_INICIALES));
    return SOLICITUDES_INICIALES;
  }

  private guardarEnStorage(lista: SolicitudEquipo[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    this.solicitudes.set(lista);
  }

  agregarSolicitud(nueva: Omit<SolicitudEquipo, 'id' | 'estatus'>) {
    const actual = this.solicitudes();
    const registro: SolicitudEquipo = {
      ...nueva,
      id: Date.now(),
      estatus: 'PENDIENTE',
    };
    this.guardarEnStorage([registro, ...actual]);
  }

  cambiarEstatus(id: number, estatus: 'APROBADO' | 'RECHAZADO') {
    const actualizada = this.solicitudes().map((item) =>
      item.id === id ? { ...item, estatus } : item
    );
    this.guardarEnStorage(actualizada);
  }
}