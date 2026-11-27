import { Injectable, signal } from '@angular/core';

export type UserRole = 'PUBLIC' | 'PLAYER' | 'CAPTAIN' | 'ADMIN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentRole = signal<UserRole>('PUBLIC');

  getRole(): UserRole {
    return this.currentRole();
  }

  setRole(role: UserRole): void {
    this.currentRole.set(role);
  }
}