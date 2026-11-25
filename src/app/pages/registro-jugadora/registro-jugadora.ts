import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro-jugadora',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-jugadora.html',
  styleUrl: './registro-jugadora.css'
})
export class RegistroJugadora {
  jugadora = {
    nombre: '',
    apellidos: '',
    cumpleanos: '',
    posicion: '',
    numeroPlayera: null as number | null,
    correo: '',
    password: ''
  };

  mostrarPassword = false;

  posiciones: string[] = [
    'Portera',
    'Defensa',
    'Medio',
    'Delantera'
  ];

  registrarJugadora() {
    console.log('Datos de registro:', this.jugadora);
    // Aquí conectarás más adelante con tu servicio/backend
  }
}