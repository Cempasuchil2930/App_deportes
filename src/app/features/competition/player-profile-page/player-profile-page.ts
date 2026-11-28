import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LigaDataService } from '../../../shared/services/liga-data';

@Component({
  selector: 'app-player-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-profile-page.html',
})
export class PlayerProfilePageComponent implements OnInit {
  readonly ligaData = inject(LigaDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedPlayerId = signal<number>(301);

  readonly player = computed(() => this.ligaData.obtenerPerfilPorId(this.selectedPlayerId()));

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = Number(params.get('id'));
      if (idParam) {
        this.selectedPlayerId.set(idParam);
      }
    });
  }

  volverAEquipos() {
    this.router.navigate(['/equipos']);
  }
}
