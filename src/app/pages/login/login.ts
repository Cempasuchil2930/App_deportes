import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

type RolTipo = 'admin' | 'equipo' | 'jugadora';

interface ConfigRol {
  titulo: string;
  subtitulo: string;
  placeholder: string;
  boton: string;
  mostrarAvisoAdmin: boolean;
  mostrarRegistro: boolean;
  prefijoRegistro: string;
  textoRegistro: string;
  rutaRegistro: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private router = inject(Router);

  rolActivo: RolTipo = 'jugadora';
  usuario: string = '';
  password: string = '';
  recordar: boolean = false;
  mostrarPassword: boolean = false;

  rolesConfig: Record<RolTipo, ConfigRol> = {
    admin: {
      titulo: 'Panel Administrativo',
      subtitulo: 'Acceso exclusivo para gestión de la liga',
      placeholder: 'Correo o ID de Administrador',
      boton: 'Ingresar al Panel',
      mostrarAvisoAdmin: true,
      mostrarRegistro: false,
      prefijoRegistro: '',
      textoRegistro: '',
      rutaRegistro: ''
    },
    equipo: {
      titulo: 'Acceso de Clubes',
      subtitulo: 'Gestiona tu plantilla, partidos y estadísticas',
      placeholder: 'ID del Equipo o Correo del Club',
      boton: 'Ingresar como Equipo',
      mostrarAvisoAdmin: false,
      mostrarRegistro: true,
      prefijoRegistro: '¿Aún no inscribes a tu equipo?',
      textoRegistro: 'Registra tu club aquí',
      rutaRegistro: '/registro-equipo'
    },
    jugadora: {
      titulo: 'Bienvenida a la Cancha',
      subtitulo: 'Inicia sesión para ver tu perfil y calendario',
      placeholder: 'Correo electrónico o usuario',
      boton: 'Iniciar Sesión',
      mostrarAvisoAdmin: false,
      mostrarRegistro: true,
      prefijoRegistro: '¿Aún no tienes cuenta?',
      textoRegistro: 'Regístrate como jugadora',
      rutaRegistro: '/registro-jugadora'
    }
  };

  get configActual(): ConfigRol {
    return this.rolesConfig[this.rolActivo];
  }

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuarioRecordado');
    if (usuarioGuardado) {
      this.usuario = usuarioGuardado;
      this.recordar = true;
    }
  }

  cambiarRol(rol: RolTipo) {
    this.rolActivo = rol;
  }

  iniciarSesion() {
    if (!this.usuario.trim() || !this.password.trim()) return;

    if (this.recordar) {
      localStorage.setItem('usuarioRecordado', this.usuario);
    } else {
      localStorage.removeItem('usuarioRecordado');
    }

    localStorage.setItem('sesionActiva', JSON.stringify({
      usuario: this.usuario,
      rol: this.rolActivo
    }));

    this.router.navigate(['/home']);
  }
}