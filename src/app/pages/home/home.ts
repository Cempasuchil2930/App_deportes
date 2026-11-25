import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private router = inject(Router);

  seccionActiva: 'partidos' | 'noticias' | 'ligas' | 'estadisticas' = 'partidos';
  busqueda: string = '';
  usuarioActual: string = 'Invitada';
  rolActual: string = 'jugadora';
  menuMovilAbierto: boolean = false;

  ngOnInit() {
    const sesion = localStorage.getItem('sesionActiva');
    if (sesion) {
      const datos = JSON.parse(sesion);
      this.usuarioActual = datos.usuario;
      this.rolActual = datos.rol;
    }
  }

  cambiarSeccion(seccion: 'partidos' | 'noticias' | 'ligas' | 'estadisticas') {
    this.seccionActiva = seccion;
    this.menuMovilAbierto = false;
  }

  cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    this.router.navigate(['/login']);
  }
}