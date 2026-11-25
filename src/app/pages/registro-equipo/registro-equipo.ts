import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-equipo.html',
  styleUrl: './registro-equipo.css'
})
export class RegistroEquipo {
  equipo = {
    idEquipo: '',
    nombre: '',
    correo: '',
    password: ''
  };

  mostrarPassword = false;

  registrarEquipo() {
    console.log('Datos de registro de equipo:', this.equipo);
    // Aquí conectarás más adelante con tu servicio/backend
  }
}
