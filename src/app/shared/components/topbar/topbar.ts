import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.html',
})
export class TopbarComponent {
  @Input() pageTitle = 'Inicio & Comunidad';
  @Input() currentRole = 'PUBLIC';
  @Output() toggleMobileMenu = new EventEmitter<void>();

  get roleLabel(): string {
    const labels: Record<string, string> = {
      PUBLIC: 'Público / Patrocinador',
      PLAYER: 'Jugadora Registrada',
      CAPTAIN: 'Capitana / Manager',
      ADMIN: 'Admin General (Nayeli)',
    };
    return labels[this.currentRole] || 'Público / Patrocinador';
  }
}
