import { Injectable, signal } from '@angular/core';

export type UserRole = 'PUBLIC' | 'PLAYER' | 'CAPTAIN' | 'ADMIN';

export interface SesionActiva {
  email: string;
  role: UserRole;
  nombre: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'sesionActiva';
  currentRole = signal<UserRole>('PUBLIC');

  constructor() {
    this.cargarSesionDesdeStorage();
  }

  private cargarSesionDesdeStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SesionActiva;
        if (parsed && parsed.role) {
          this.currentRole.set(parsed.role);
        }
      }
    } catch {
      this.currentRole.set('PUBLIC');
    }
  }

  iniciarSesion(email: string, role: UserRole, nombre?: string): void {
    const nombresPorDefecto: Record<UserRole, string> = {
      ADMIN: 'Coach Nayeli',
      CAPTAIN: 'Capitana',
      PLAYER: 'Jugadora',
      PUBLIC: 'Invitada'
    };

    const sesion: SesionActiva = {
      email,
      role,
      nombre: nombre || nombresPorDefecto[role],
      activa: role !== 'PUBLIC'
    };

    if (role === 'PUBLIC') {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sesion));
    }

    this.currentRole.set(role);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentRole.set('PUBLIC');
  }

  getRole(): UserRole {
    return this.currentRole();
  }

  setRole(role: UserRole): void {
    this.iniciarSesion('', role);
  }
}