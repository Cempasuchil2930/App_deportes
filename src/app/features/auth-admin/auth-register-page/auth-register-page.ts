import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

type ActiveView = 'LOGIN' | 'REGISTER_PLAYER' | 'REGISTER_TEAM' | 'RECOVER';
type LoginRoleTab = 'ADMIN' | 'CAPTAIN' | 'PLAYER';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#FAF9F7] dark:bg-[#0B0D10] text-[#111111] dark:text-slate-100 p-4 sm:p-6 flex flex-col">
      
      <!-- Mensaje de confirmación -->
      <div *ngIf="feedbackMessage()" class="max-w-[540px] w-full mx-auto mb-4 rounded-xl px-4 py-3 bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800 text-xs font-bold text-[#059669] dark:text-emerald-300 flex items-center justify-between">
        <span>✓ {{ feedbackMessage() }}</span>
        <button type="button" (click)="feedbackMessage.set('')" class="text-xs underline cursor-pointer">Cerrar</button>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 1: INICIAR SESIÓN (/login)                                  -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'LOGIN'" class="flex-1 flex items-center justify-center py-6">
        <div class="w-full max-w-[500px] rounded-3xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] shadow-lg overflow-hidden">
          
          <div class="h-[2px] w-full bg-gradient-to-r from-[#F43F5E] via-[#EAB308] via-[#10B981] via-[#3B82F6] to-[#8B5CF6]"></div>

          <div class="p-7 sm:p-8 space-y-6">
            <div class="text-center space-y-1.5">
              <span
                [ngClass]="{
                  'bg-[#FFF1F2] dark:bg-rose-950/60 text-[#F43F5E] border-[#FECDD3] dark:border-rose-800/70': selectedLoginRole() === 'ADMIN',
                  'bg-[#EFF6FF] dark:bg-blue-950/60 text-[#3B82F6] border-blue-200 dark:border-blue-800/70': selectedLoginRole() === 'CAPTAIN',
                  'bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 border-[#DDD6FE] dark:border-purple-800/70': selectedLoginRole() === 'PLAYER'
                }"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border">
                <span>●</span>
                <span>
                  {{ selectedLoginRole() === 'ADMIN' ? 'Rol: Administrador' : selectedLoginRole() === 'CAPTAIN' ? 'Rol: Equipo' : 'Rol: Jugadora' }}
                </span>
              </span>

              <h1 class="text-2xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                Iniciar Sesión
              </h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ selectedLoginRole() === 'ADMIN'
                  ? 'Acceso exclusivo para Coach Nayeli: validación de altas, expedientes médicos y cédulas arbitrales.'
                  : selectedLoginRole() === 'CAPTAIN'
                  ? 'Administra el roster oficial de tu equipo, dorsales y disponibilidad dominical.'
                  : 'Consulta tu ficha estilo FotMob, minutos jugados en partidos de 40 min y preferencias de privacidad.' }}
              </p>
            </div>

            <!-- Cápsulas Luminosas por Rol -->
            <div class="space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Selecciona tu rol de acceso
              </p>
              <div class="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  (click)="selectLoginRole('ADMIN')"
                  [ngClass]="selectedLoginRole() === 'ADMIN'
                    ? 'bg-[#FFF1F2] dark:bg-rose-950/50 border-[#F43F5E] text-[#BE123C] dark:text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.25)]'
                    : 'bg-[#FAF9F7] dark:bg-[#0B0D10] border-[#ECEAE6] dark:border-[#232730] text-slate-600 dark:text-slate-300 hover:border-[#F43F5E]'"
                  class="px-3 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer">
                  <span>Administrador</span>
                </button>

                <button
                  type="button"
                  (click)="selectLoginRole('CAPTAIN')"
                  [ngClass]="selectedLoginRole() === 'CAPTAIN'
                    ? 'bg-[#EFF6FF] dark:bg-blue-950/50 border-[#3B82F6] text-[#1D4ED8] dark:text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.25)]'
                    : 'bg-[#FAF9F7] dark:bg-[#0B0D10] border-[#ECEAE6] dark:border-[#232730] text-slate-600 dark:text-slate-300 hover:border-[#3B82F6]'"
                  class="px-3 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer">
                  <span>Equipo</span>
                </button>

                <button
                  type="button"
                  (click)="selectLoginRole('PLAYER')"
                  [ngClass]="selectedLoginRole() === 'PLAYER'
                    ? 'bg-[#F5F3FF] dark:bg-purple-950/50 border-[#8B5CF6] text-[#6D28D9] dark:text-purple-300 shadow-[0_0_18px_rgba(139,92,246,0.25)]'
                    : 'bg-[#FAF9F7] dark:bg-[#0B0D10] border-[#ECEAE6] dark:border-[#232730] text-slate-600 dark:text-slate-300 hover:border-[#8B5CF6]'"
                  class="px-3 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer">
                  <span>Jugadora</span>
                </button>
              </div>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="correo@mujeresdiversas.mx"
                  class="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-white focus:ring-4 focus:ring-purple-500/15 transition-all" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200">
                    Contraseña
                  </label>
                  <a routerLink="/recuperar-password" class="text-[11px] font-semibold text-slate-500 hover:text-[#111111] dark:hover:text-white underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div class="relative">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••••••"
                    class="w-full px-4 py-2.5 pr-11 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-white focus:ring-4 focus:ring-purple-500/15 transition-all" />
                  <button
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer">
                    <svg *ngIf="!showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg *ngIf="showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center pt-0.5">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="rememberMe" class="w-4 h-4 rounded border-slate-300 accent-[#111111]" />
                  <span class="text-xs text-slate-600 dark:text-slate-400">Recordarme en este dispositivo</span>
                </label>
              </div>

              <button
                type="submit"
                [disabled]="loginForm.invalid"
                class="w-full py-3 px-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold tracking-wide shadow-md hover:shadow-[0_8px_24px_-4px_rgba(139,92,246,0.45)] disabled:opacity-50 transition-all cursor-pointer">
                Iniciar Sesión →
              </button>
            </form>

            <!-- Pie dinámico según rol -->
            <div *ngIf="selectedLoginRole() !== 'ADMIN'" class="pt-4 border-t border-[#ECEAE6] dark:border-[#232730] text-center space-y-2">
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ selectedLoginRole() === 'CAPTAIN'
                  ? '¿Quieres dar de alta a tu equipo en la 4.ª Edición?'
                  : '¿Aún no tienes dorsal en la 4.ª Edición?' }}
              </p>
              <a
                [routerLink]="selectedLoginRole() === 'CAPTAIN' ? '/registro-equipo' : '/registro-jugadora'"
                [ngClass]="selectedLoginRole() === 'CAPTAIN'
                  ? 'hover:border-[#3B82F6] text-[#1D4ED8] dark:text-blue-300'
                  : 'hover:border-[#8B5CF6] text-[#6D28D9] dark:text-purple-300'"
                class="block w-full py-2.5 px-4 rounded-full bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-xs font-bold transition-all">
                {{ selectedLoginRole() === 'CAPTAIN'
                  ? 'Inscribir a mi Equipo →'
                  : 'Registrarme como Jugadora →' }}
              </a>
            </div>

            <div *ngIf="selectedLoginRole() === 'ADMIN'" class="pt-3 border-t border-[#ECEAE6] dark:border-[#232730] text-center">
              <p class="text-[11px] text-slate-400 dark:text-slate-500">
                Cuenta única habilitada para Administración General de la Liga.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 2: RECUPERAR CONTRASEÑA (/recuperar-password)               -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'RECOVER'" class="flex-1 flex items-center justify-center py-6">
        <div class="w-full max-w-[460px] rounded-3xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] shadow-lg overflow-hidden">
          <div class="h-[2px] w-full bg-gradient-to-r from-[#F43F5E] via-[#EAB308] via-[#10B981] via-[#3B82F6] to-[#8B5CF6]"></div>

          <div class="p-7 sm:p-8 space-y-5">
            <div class="text-center space-y-1.5">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#EFF6FF] dark:bg-blue-950/60 text-[#3B82F6] border border-blue-200 dark:border-blue-800/70">
                Soporte de Cuenta
              </span>
              <h1 class="text-2xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                Recuperar Contraseña
              </h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Ingresa el correo registrado en la liga y te enviaremos un enlace para restablecer tu clave de acceso.
              </p>
            </div>

            <form [formGroup]="recoverForm" (ngSubmit)="onRecoverSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1.5">
                  Correo electrónico registrado *
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="ejemplo@mujeresdiversas.mx"
                  class="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-white" />
              </div>

              <button
                type="submit"
                [disabled]="recoverForm.invalid"
                class="w-full py-3 px-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold tracking-wide shadow-md disabled:opacity-50 transition-all cursor-pointer">
                Enviar enlace de restablecimiento →
              </button>
            </form>

            <div class="pt-4 border-t border-[#ECEAE6] dark:border-[#232730] text-center">
              <a routerLink="/login" class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#111111] dark:hover:text-white underline">
                ← Volver a Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 3 Y 4: REGISTRO JUGADORA (/registro-jugadora) Y             -->
      <!--              REGISTRO EQUIPO (/registro-equipo)                   -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'REGISTER_PLAYER' || activeView() === 'REGISTER_TEAM'" class="max-w-6xl w-full mx-auto space-y-5">
        
        <div class="rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] shadow-xs overflow-hidden">
          <div class="h-[2px] w-full bg-gradient-to-r from-[#F43F5E] via-[#EAB308] via-[#10B981] via-[#3B82F6] to-[#8B5CF6]"></div>
          <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981] mb-1">
                <span>•</span>
                <span>Inscripción Oficial • 4.ª Edición CDMX</span>
              </div>
              <h1 class="text-xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                {{ activeView() === 'REGISTER_TEAM' ? 'Registro de Equipo y Capitana' : 'Registro de Jugadora' }}
              </h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Privacidad garantizada: en el directorio público solo se muestra apodo de camiseta, dorsal y posición.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <a
                routerLink="/registro-equipo"
                [ngClass]="activeView() === 'REGISTER_TEAM'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white font-bold'
                  : 'bg-[#FAF9F7] dark:bg-[#0B0D10] text-slate-700 dark:text-slate-300 border-[#ECEAE6] dark:border-[#232730] font-semibold'"
                class="px-4 py-2 rounded-full text-xs border transition-all">
                Inscribir Equipo
              </a>
              <a
                routerLink="/registro-jugadora"
                [ngClass]="activeView() === 'REGISTER_PLAYER'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white font-bold'
                  : 'bg-[#FAF9F7] dark:bg-[#0B0D10] text-slate-700 dark:text-slate-300 border-[#ECEAE6] dark:border-[#232730] font-semibold'"
                class="px-4 py-2 rounded-full text-xs border transition-all">
                Jugadora
              </a>
              <a
                routerLink="/login"
                class="px-4 py-2 rounded-full text-xs font-bold bg-[#FAF9F7] dark:bg-[#0B0D10] text-[#111111] dark:text-white border border-[#ECEAE6] dark:border-[#232730] hover:border-[#111111] transition-all">
                ← Iniciar Sesión
              </a>
            </div>
          </div>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          <div class="lg:col-span-7 space-y-5">
            <!-- Bloque Equipo (Solo en /registro-equipo) -->
            <div *ngIf="activeView() === 'REGISTER_TEAM'" class="rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] p-5 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] dark:bg-blue-950/60 text-[#3B82F6] border border-blue-200 dark:border-blue-800">
                    Registro de Equipo
                  </span>
                  <h3 class="text-xs font-extrabold text-[#111111] dark:text-white">Datos de la Escuadra</h3>
                </div>
                <span class="text-[11px] text-slate-400">Torneo 40 min • 12 Equipos</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Equipo *</label>
                  <input type="text" formControlName="teamName" placeholder="Ej. Fénix F.C."
                    class="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#3B82F6]" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Color Distintivo *</label>
                  <input type="text" formControlName="jerseyColor" placeholder="Naranja / Negro"
                    class="w-full px-3 py-2 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#3B82F6]" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Abreviatura (3 letras) *</label>
                  <input type="text" maxlength="3" formControlName="teamCode" placeholder="FNX"
                    class="w-full px-3 py-2 rounded-xl text-xs font-mono font-extrabold uppercase bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#3B82F6]" />
                </div>
              </div>
            </div>

            <!-- Datos Públicos -->
            <div class="rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] p-5 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-2.5 border-b border-[#ECEAE6] dark:border-[#232730]">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <h3 class="text-sm font-extrabold text-[#111111] dark:text-white">
                    {{ activeView() === 'REGISTER_TEAM' ? 'Datos de la Capitana / Manager' : 'Datos Públicos Deportivos' }}
                  </h3>
                </div>
                <span class="text-[11px] text-slate-400">Apodo, dorsal y posición</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Nombre completo *</label>
                  <input type="text" formControlName="fullName" placeholder="Nombre y apellidos"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Apodo / Nombre en camiseta *</label>
                  <input type="text" formControlName="shirtName" placeholder="Ej. Val"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Número de dorsal *</label>
                  <input type="number" min="1" max="99" formControlName="dorsal"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-mono font-extrabold bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Posición *</label>
                  <select formControlName="position"
                    class="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]">
                    <option value="Portera">Portera</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Media">Media</option>
                    <option value="Delantera">Delantera</option>
                  </select>
                </div>

                <!-- Selector de Equipo para Jugadora Individual -->
                <div *ngIf="activeView() === 'REGISTER_PLAYER'">
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Equipo *</label>
                  <select formControlName="selectedTeam"
                    class="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]">
                    <option value="Agente Libre (Por asignar)">Agente Libre (Por asignar)</option>
                    <option *ngFor="let team of officialTeams" [value]="team">{{ team }}</option>
                  </select>
                </div>

                <div *ngIf="activeView() === 'REGISTER_TEAM'">
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1">Estatus *</label>
                  <select formControlName="playerStatus"
                    class="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111]">
                    <option value="Alta nueva">Alta nueva</option>
                    <option value="Equipo activo de ediciones anteriores">Equipo activo de ediciones anteriores</option>
                  </select>
                </div>
              </div>

              <!-- Pronombres (#8B5CF6) -->
              <div>
                <label class="flex items-center gap-1.5 text-xs font-bold text-[#111111] dark:text-slate-200 mb-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                  <span>Pronombres (Visible en ficha y tarjeta de jugadora)</span>
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    *ngFor="let p of pronounsList"
                    type="button"
                    (click)="registerForm.patchValue({ pronouns: p })"
                    [ngClass]="registerForm.get('pronouns')?.value === p
                      ? 'bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 border-[#8B5CF6] font-bold'
                      : 'bg-[#FAF9F7] dark:bg-[#0B0D10] text-slate-600 dark:text-slate-400 border-[#ECEAE6] dark:border-[#232730] font-semibold hover:border-[#8B5CF6]'"
                    class="py-2 px-3 rounded-full text-xs border transition cursor-pointer">
                    {{ p }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Consentimientos Obligatorios -->
            <div class="rounded-2xl bg-white dark:bg-[#14171C] border border-[#ECEAE6] dark:border-[#232730] p-5 shadow-xs space-y-3.5">
              <div class="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#FAF9F7] dark:bg-[#0B0D10] border border-[#ECEAE6] dark:border-[#232730]">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-[#111111] dark:text-white">
                      Autorización de uso de fotografía en la web y redes sociales
                    </span>
                    <span
                      [ngClass]="registerForm.get('photoAuthorized')?.value ? 'text-[#10B981]' : 'text-[#8B5CF6]'"
                      class="text-[11px] font-bold">
                      {{ registerForm.get('photoAuthorized')?.value ? '✓ Imagen pública autorizada' : 'Avatar ilustrado por defecto' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Si lo desactivas, se mostrará un avatar ilustrado oficial en tu perfil público.
                  </p>
                </div>

                <button
                  type="button"
                  (click)="togglePhotoAuthorization()"
                  [ngClass]="registerForm.get('photoAuthorized')?.value ? 'bg-[#10B981]' : 'bg-slate-400 dark:bg-slate-700'"
                  class="w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 cursor-pointer flex items-center">
                  <span
                    [ngClass]="registerForm.get('photoAuthorized')?.value ? 'translate-x-5' : 'translate-x-0'"
                    class="w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200">
                  </span>
                </button>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
                <label class="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" formControlName="privacyAccepted" class="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#111111]" />
                  <span class="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    <strong>Acepto el Aviso de Privacidad</strong> y el resguardo confidencial de mis datos médicos. *
                  </span>
                </label>

                <button
                  type="submit"
                  [disabled]="registerForm.invalid"
                  class="px-5 py-2.5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold shrink-0 shadow-sm hover:shadow-[0_8px_22px_-4px_rgba(139,92,246,0.4)] disabled:opacity-45 transition-all cursor-pointer">
                  Enviar Solicitud de Registro
                </button>
              </div>
            </div>
          </div>

          <!-- BLOQUE CONFIDENCIAL PROTEGIDO (#8B5CF6) -->
          <div class="lg:col-span-5">
            <div class="rounded-2xl bg-[#FAF7FF] dark:bg-[#171326] border border-[#DDD6FE] dark:border-purple-800/80 p-5 shadow-xs space-y-4">
              
              <div class="flex items-start gap-3 pb-3 border-b border-[#EDE9FE] dark:border-purple-800/60">
                <div class="w-9 h-9 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-[#5B21B6] dark:text-purple-200 leading-tight">
                    Expediente Confidencial Protegido
                  </h3>
                  <p class="text-[11px] font-semibold text-[#7C3AED] dark:text-purple-300 mt-0.5">
                    Solo visible para Administración General (Coach Nayeli)
                  </p>
                </div>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-bold text-[#4C1D95] dark:text-purple-200 mb-1">
                    Teléfono personal *
                  </label>
                  <input type="tel" formControlName="personalPhone" placeholder="55 0000 0000"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0B0D10] border border-[#DDD6FE] dark:border-purple-800/70 text-[#111111] dark:text-white focus:outline-none focus:border-[#8B5CF6]" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#4C1D95] dark:text-purple-200 mb-1">
                    Zona / Dirección *
                  </label>
                  <input type="text" formControlName="zoneAddress" placeholder="Ej. Benito Juárez, CDMX"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0B0D10] border border-[#DDD6FE] dark:border-purple-800/70 text-[#111111] dark:text-white focus:outline-none focus:border-[#8B5CF6]" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#4C1D95] dark:text-purple-200 mb-1">
                    Nombre y teléfono de contacto de emergencia *
                  </label>
                  <input type="text" formControlName="emergencyContact" placeholder="Nombre (Parentesco) • 55 0000 0000"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0B0D10] border border-[#DDD6FE] dark:border-purple-800/70 text-[#111111] dark:text-white focus:outline-none focus:border-[#8B5CF6]" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#4C1D95] dark:text-purple-200 mb-1">
                    Padecimientos médicos / alergias *
                  </label>
                  <textarea rows="3" formControlName="medicalConditions" placeholder="Indica alergias, asma, lesiones previas o 'Ninguno'"
                    class="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#0B0D10] border border-[#DDD6FE] dark:border-purple-800/70 text-[#111111] dark:text-white focus:outline-none focus:border-[#8B5CF6] resize-none"></textarea>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white/80 dark:bg-[#0B0D10]/80 border border-[#EDE9FE] dark:border-purple-800/60 text-[11px] text-[#6D28D9] dark:text-purple-300 leading-relaxed">
                <strong>Confidencialidad Garantizada:</strong> Esta información nunca se publica en la web ni se comparte con otros equipos; solo es accesible por Administración General en caso de emergencia en cancha.
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  `
})
export class AuthRegisterPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  activeView = signal<ActiveView>('LOGIN');
  selectedLoginRole = signal<LoginRoleTab>('ADMIN');
  showPassword = signal<boolean>(false);
  feedbackMessage = signal<string>('');

  pronounsList = ['Ella / She', 'Elle / They', 'Él / He'];
  officialTeams = [
    'Queer Goals',
    'Valquirias',
    'F.C. Lionesses',
    'Good Vibes',
    'Lobas México',
    'Atlético Diversa',
    'Bandidas F.C.',
    'All Stars GV',
    'Fénix F.C.',
    'Real Madrid',
    'TBD United',
    'Unknown'
  ];

  loginForm: FormGroup = this.fb.group({
    email: ['nayeli.coach@mujeresdiversas.mx', [Validators.required, Validators.email]],
    password: ['12345678', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  recoverForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  registerForm: FormGroup = this.fb.group({
    teamName: ['Fénix F.C.'],
    jerseyColor: ['Naranja / Negro'],
    teamCode: ['FNX'],
    fullName: ['', [Validators.required]],
    shirtName: ['', [Validators.required]],
    dorsal: [10, [Validators.required, Validators.min(1), Validators.max(99)]],
    position: ['Media', [Validators.required]],
    selectedTeam: ['Queer Goals'],
    pronouns: ['Ella / She', [Validators.required]],
    playerStatus: ['Alta nueva', [Validators.required]],
    personalPhone: ['', [Validators.required]],
    zoneAddress: ['', [Validators.required]],
    emergencyContact: ['', [Validators.required]],
    medicalConditions: ['Ninguno', [Validators.required]],
    photoAuthorized: [true],
    privacyAccepted: [false, [Validators.requiredTrue]]
  });

  ngOnInit(): void {
    const viewParam = this.route.snapshot.data?.['view'] as ActiveView | undefined;
    if (viewParam) {
      this.activeView.set(viewParam);
      this.configurarValidadoresRegistro(viewParam);
    }
  }

  private configurarValidadoresRegistro(view: ActiveView): void {
    const teamNameCtrl = this.registerForm.get('teamName');
    const teamCodeCtrl = this.registerForm.get('teamCode');
    const jerseyColorCtrl = this.registerForm.get('jerseyColor');

    if (view === 'REGISTER_TEAM') {
      teamNameCtrl?.setValidators([Validators.required]);
      teamCodeCtrl?.setValidators([Validators.required]);
      jerseyColorCtrl?.setValidators([Validators.required]);
    } else {
      teamNameCtrl?.clearValidators();
      teamCodeCtrl?.clearValidators();
      jerseyColorCtrl?.clearValidators();
    }
    teamNameCtrl?.updateValueAndValidity();
    teamCodeCtrl?.updateValueAndValidity();
    jerseyColorCtrl?.updateValueAndValidity();
  }

  selectLoginRole(role: LoginRoleTab): void {
    this.selectedLoginRole.set(role);
    const defaultEmails: Record<LoginRoleTab, string> = {
      ADMIN: 'nayeli.coach@mujeresdiversas.mx',
      CAPTAIN: 'val.rios@queergoals.mx',
      PLAYER: 'sofi.navarro@fclionesses.mx'
    };
    this.loginForm.patchValue({ email: defaultEmails[role] });
  }

  togglePhotoAuthorization(): void {
    const current = this.registerForm.get('photoAuthorized')?.value;
    this.registerForm.patchValue({ photoAuthorized: !current });
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;
    const role = this.selectedLoginRole();
    const email = this.loginForm.value.email;

    // Guarda en localStorage bajo la llave 'sesionActiva'
    this.authService.iniciarSesion(email, role);

    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.feedbackMessage.set(`Sesión guardada en localStorage (sesionActiva) con rol: ${role}`);
    }
  }

  onRecoverSubmit(): void {
    if (this.recoverForm.invalid) return;
    const email = this.recoverForm.value.email;
    this.feedbackMessage.set(`Enlace de restablecimiento enviado a ${email}. Revisa tu bandeja.`);
    this.recoverForm.reset();
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) return;
    this.feedbackMessage.set('Solicitud enviada en estado PENDING a la bandeja de Administración General.');
    this.registerForm.reset({
      dorsal: 10,
      position: 'Media',
      selectedTeam: 'Queer Goals',
      pronouns: 'Ella / She',
      playerStatus: 'Alta nueva',
      medicalConditions: 'Ninguno',
      photoAuthorized: true,
      privacyAccepted: false
    });
  }
}