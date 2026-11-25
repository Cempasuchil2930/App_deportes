import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPassword {
  pasoActual: 1 | 2 | 3 | 4 = 1; // 1: Correo, 2: Código, 3: Nueva clave, 4: Éxito

  correo: string = '';
  codigoVerificacion: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';

  mostrarNueva: boolean = false;
  mostrarConfirmar: boolean = false;
  mensajeError: string = '';

  // Paso 1: Enviar código al correo
  enviarCodigo() {
    this.mensajeError = '';
    if (!this.correo.trim()) {
      this.mensajeError = 'Por favor ingresa un correo válido.';
      return;
    }
    console.log('Código de verificación enviado a:', this.correo);
    this.pasoActual = 2;
  }

  // Paso 2: Validar código de 6 dígitos
  verificarCodigo() {
    this.mensajeError = '';
    if (this.codigoVerificacion.trim().length < 6) {
      this.mensajeError = 'Ingresa el código completo de 6 dígitos.';
      return;
    }
    console.log('Código verificado:', this.codigoVerificacion);
    this.pasoActual = 3;
  }

  // Paso 3: Guardar nueva contraseña
  guardarNuevaPassword() {
    this.mensajeError = '';
    if (this.nuevaPassword.length < 8) {
      this.mensajeError = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }
    console.log('Contraseña actualizada correctamente para:', this.correo);
    this.pasoActual = 4;
  }

  volverPaso1() {
    this.mensajeError = '';
    this.codigoVerificacion = '';
    this.pasoActual = 1;
  }
}