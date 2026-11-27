import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

type ActiveView = 'LOGIN' | 'REGISTER_TEAM' | 'RECOVER';
type LoginRoleTab = 'ADMIN' | 'CAPTAIN';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './auth-register-page.css',
  template: `
    <div class="team-register-aura-bg min-h-screen text-[#111111] dark:text-slate-100 p-4 sm:p-8 flex flex-col transition-colors duration-300">
      
      <!-- Mensaje de éxito -->
      <div *ngIf="feedbackMessage()" class="max-w-[780px] w-full mx-auto mb-4 rounded-2xl px-4 py-3 bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800 text-xs font-bold text-[#059669] dark:text-emerald-300 flex items-center justify-between shadow-xs">
        <span>✓ {{ feedbackMessage() }}</span>
        <button type="button" (click)="feedbackMessage.set('')" class="text-xs underline cursor-pointer">Cerrar</button>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="errorMessage()" class="max-w-[500px] w-full mx-auto mb-4 rounded-2xl px-4 py-3 bg-[#FFF1F2] dark:bg-rose-950/60 border border-[#FECDD3] dark:border-rose-800 text-xs font-bold text-[#E11D48] dark:text-rose-300 flex items-center justify-between shadow-xs">
        <span>✕ {{ errorMessage() }}</span>
        <button type="button" (click)="errorMessage.set('')" class="text-xs underline cursor-pointer">Cerrar</button>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 1: INICIAR SESIÓN (/login)                                  -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'LOGIN'" class="flex-1 flex items-center justify-center py-6">
        <div class="login-rainbow-frame w-full max-w-[486px]">
          <div class="login-rainbow-inner w-full overflow-hidden">

            <div class="p-7 sm:p-8 space-y-6">
              <div class="text-center space-y-2">
                <span
                  [ngClass]="selectedLoginRole() === 'ADMIN'
                    ? 'bg-[#FCE7EB] dark:bg-rose-950/60 text-[#9F3A4B] dark:text-rose-300'
                    : 'bg-[#E5EFFC] dark:bg-blue-950/60 text-[#2E5B9A] dark:text-blue-300'"
                  class="inline-flex items-center px-4 py-1 rounded-full text-[11px] font-bold">
                  {{ selectedLoginRole() === 'ADMIN' ? 'Rol: Administradora' : 'Rol: Equipo' }}
                </span>

                <h1 class="text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#111111] dark:text-white">
                  Iniciar Sesión
                </h1>

                <p class="text-xs text-slate-600 dark:text-slate-400">
                  {{ selectedLoginRole() === 'ADMIN'
                    ? 'Acceso exclusivo para Coach Nayeli.'
                    : 'Accede con tu cuenta de equipo para consultar entrenamientos, tablas y estadísticas.' }}
                </p>
              </div>

              <!-- Solo 2 Roles: Administradora y Equipo -->
              <div class="space-y-2.5">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                  Selecciona tu perfil de acceso
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    (click)="selectLoginRole('ADMIN')"
                    [ngClass]="selectedLoginRole() === 'ADMIN'
                      ? 'bg-[#FCE7EB]/85 dark:bg-rose-950/50 border-[#C57B87] text-[#8E3545] dark:text-rose-300'
                      : 'bg-slate-100/80 dark:bg-[#0B0D10]/80 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200/70'"
                    class="px-4 py-3 rounded-full border text-xs font-bold flex items-center justify-center transition-colors cursor-pointer">
                    <span>Administradora</span>
                  </button>

                  <button
                    type="button"
                    (click)="selectLoginRole('CAPTAIN')"
                    [ngClass]="selectedLoginRole() === 'CAPTAIN'
                      ? 'bg-[#E5EFFC]/85 dark:bg-blue-950/50 border-[#7FA3D4] text-[#2B548C] dark:text-blue-300'
                      : 'bg-slate-100/80 dark:bg-[#0B0D10]/80 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200/70'"
                    class="px-4 py-3 rounded-full border text-xs font-bold flex items-center justify-center transition-colors cursor-pointer">
                    <span>Equipo</span>
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
                    class="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-white/85 dark:bg-[#0B0D10] border border-slate-200/90 dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-white transition-colors" />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-xs font-bold text-[#111111] dark:text-slate-200">
                      Contraseña
                    </label>
                    <a routerLink="/recuperar-password" class="text-[11px] font-semibold text-slate-600 hover:text-[#111111] dark:hover:text-white underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div class="relative">
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      placeholder="••••••••••••"
                      class="w-full px-4 py-2.5 pr-11 rounded-xl text-xs font-medium bg-white/85 dark:bg-[#0B0D10] border border-slate-200/90 dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-white transition-colors" />
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
                  class="w-full py-3 px-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold tracking-wide shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer">
                  Iniciar Sesión →
                </button>
              </form>

              <!-- Opción Inscribir Equipo (Solo en pestaña Equipo) -->
              <div *ngIf="selectedLoginRole() === 'CAPTAIN'" class="pt-4 border-t border-slate-200/70 dark:border-[#232730] text-center space-y-2">
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  ¿Quieres dar de alta a tu equipo en la 4.ª Edición?
                </p>
                <a
                  routerLink="/registro-equipo"
                  class="block w-full py-2.5 px-4 rounded-full bg-[#E5EFFC]/70 dark:bg-blue-950/30 border border-[#7FA3D4]/60 hover:bg-[#E5EFFC] text-[#2B548C] dark:text-blue-300 text-xs font-bold transition-colors">
                  Inscribir a mi Equipo →
                </a>
              </div>

              <!-- Separador "O TAMBIÉN" centrado -->
              <div class="pt-1 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="h-px flex-1 bg-slate-200/90 dark:bg-[#232730]"></div>
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    O TAMBIÉN
                  </span>
                  <div class="h-px flex-1 bg-slate-200/90 dark:bg-[#232730]"></div>
                </div>

                <button
                  type="button"
                  (click)="enterAsGuest()"
                  class="w-full py-2.5 px-4 rounded-full bg-white/85 dark:bg-[#0B0D10] hover:bg-white dark:hover:bg-[#1A1E26] border border-slate-200/90 dark:border-[#232730] text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-2xs">
                  <span>Entrar como Invitada</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 2: RECUPERAR CONTRASEÑA (/recuperar-password)               -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'RECOVER'" class="flex-1 flex items-center justify-center py-6">
        <div class="login-rainbow-frame w-full max-w-[486px]">
          <div class="login-rainbow-inner w-full overflow-hidden">

            <div class="p-7 sm:p-8 space-y-6">
              <div class="text-center space-y-2">
                <h1 class="text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#111111] dark:text-white">
                  Recuperar Contraseña
                </h1>
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  Ingresa el correo registrado en la liga y te enviaremos un enlace para restablecer tu clave de acceso.
                </p>
              </div>

              <form [formGroup]="recoverForm" (ngSubmit)="onRecoverSubmit()" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-[#111111] dark:text-slate-200 mb-1.5">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="correo@mujeresdiversas.mx"
                    class="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-white/85 dark:bg-[#0B0D10] border border-slate-200/90 dark:border-[#232730] text-[#111111] dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-white transition-colors" />
                </div>

                <button
                  type="submit"
                  [disabled]="recoverForm.invalid"
                  class="w-full py-3 px-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold tracking-wide shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer">
                  Enviar enlace de restablecimiento →
                </button>
              </form>

              <div class="pt-4 border-t border-slate-200/70 dark:border-[#232730] text-center">
                <a routerLink="/login" class="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#111111] dark:hover:text-white underline">
                  ← Volver a Iniciar Sesión
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- VISTA 3: INSCRIBIR EQUIPO (/registro-equipo)                      -->
      <!-- ================================================================= -->
      <div *ngIf="activeView() === 'REGISTER_TEAM'" class="max-w-[780px] w-full mx-auto py-4 sm:py-6 space-y-6">
        
        <div class="flex items-center justify-between gap-4 px-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Inscribir Equipo
          </h1>

          <a
            routerLink="/login"
            class="px-5 py-2.5 rounded-full text-xs font-bold bg-white/90 dark:bg-[#14171C]/90 text-[#111111] dark:text-white border border-white/80 dark:border-[#232730] shadow-sm hover:bg-white transition-all backdrop-blur-md">
            ← Volver a Iniciar Sesión
          </a>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-6">
          
          <!-- Tarjeta 1: Datos del Equipo -->
          <div class="glass-form-card rounded-3xl p-6 sm:p-7 space-y-5">
            <div class="pb-3 border-b border-slate-200/70 dark:border-slate-700/60">
              <h2 class="text-base font-extrabold text-[#111111] dark:text-white">
                Datos del Equipo
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  formControlName="teamName"
                  placeholder="Ej. Fénix F.C."
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Color Distintivo *
                </label>
                <input
                  type="text"
                  formControlName="jerseyColor"
                  placeholder="Naranja / Negro"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Abreviatura (3 letras) *
                </label>
                <input
                  type="text"
                  maxlength="3"
                  formControlName="teamCode"
                  placeholder="FNX"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-semibold uppercase bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>
            </div>
          </div>

          <!-- Tarjeta 2: Datos de la Capitana / Manager -->
          <div class="glass-form-card rounded-3xl p-6 sm:p-7 space-y-5">
            <div class="pb-3 border-b border-slate-200/70 dark:border-slate-700/60">
              <h2 class="text-base font-extrabold text-[#111111] dark:text-white">
                Datos de la Capitana / Manager
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  formControlName="fullName"
                  placeholder="Nombre y apellidos"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Apodo / Nombre en camiseta *
                </label>
                <input
                  type="text"
                  formControlName="shirtName"
                  placeholder="Ej. Val"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>
            </div>

            <!-- Correo y Contraseña -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="capitana@equipo.mx"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Contraseña *
                </label>
                <div class="relative">
                  <input
                    [type]="showRegisterPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Mínimo 6 caracteres"
                    [ngClass]="(registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched))
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200/90 dark:border-slate-700 focus:border-slate-400'"
                    class="w-full px-4 py-2.5 pr-11 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border text-[#111111] dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all" />
                  <button
                    type="button"
                    (click)="showRegisterPassword.set(!showRegisterPassword())"
                    [attr.aria-label]="showRegisterPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer">
                    <svg *ngIf="!showRegisterPassword()" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg *ngIf="showRegisterPassword()" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>

                <!-- Mensaje rojo si no cumple con los 6 caracteres -->
                <p
                  *ngIf="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)"
                  class="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1.5 pl-3">
                  La contraseña debe tener al menos 6 caracteres.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Número de dorsal *
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  formControlName="dorsal"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white focus:outline-none focus:bg-white focus:border-slate-400 transition-all" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Posición *
                </label>
                <select
                  formControlName="position"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white focus:outline-none focus:bg-white focus:border-slate-400 transition-all">
                  <option value="Portera">Portera</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Media">Media</option>
                  <option value="Delantera">Delantera</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Estatus *
                </label>
                <select
                  formControlName="playerStatus"
                  class="w-full px-4 py-2.5 rounded-full text-xs font-medium bg-white/75 dark:bg-[#0B0D10]/80 border border-slate-200/90 dark:border-slate-700 text-[#111111] dark:text-white focus:outline-none focus:bg-white focus:border-slate-400 transition-all">
                  <option value="Alta nueva">Alta nueva</option>
                  <option value="Equipo activo de ediciones anteriores">Equipo activo de ediciones anteriores</option>
                </select>
              </div>
            </div>

            <!-- Pronombres: solo Ella, Elle y Él -->
            <div>
              <label class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                Pronombres
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  *ngFor="let p of pronounsList"
                  type="button"
                  (click)="registerForm.patchValue({ pronouns: p })"
                  [ngClass]="registerForm.get('pronouns')?.value === p
                    ? 'bg-[#EFEAF8]/90 dark:bg-purple-950/50 text-[#5C4982] dark:text-purple-200 border-[#B6A7D6] font-bold'
                    : 'bg-white/65 dark:bg-[#0B0D10]/70 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 font-medium hover:bg-white'"
                  class="py-2.5 px-4 rounded-full text-xs border transition-colors cursor-pointer">
                  {{ p }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tarjeta 3: Consentimientos y Botón Enviar Rosita Pastel -->
          <div class="glass-form-card rounded-3xl p-6 sm:p-7 space-y-4">
            <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#0B0D10]/70 border border-slate-200/80 dark:border-slate-700">
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
                  Si lo desactivas, se mostrará un avatar ilustrado oficial en el perfil público.
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
                <span class="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  <strong>Acepto el Aviso de Privacidad</strong> y el reglamento oficial de la 4.ª Edición. *
                </span>
              </label>

              <button
                type="submit"
                [disabled]="registerForm.invalid"
                class="px-7 py-3 rounded-full bg-[#FCE7EB] hover:bg-[#F9D5DC] dark:bg-rose-950/70 dark:hover:bg-rose-900/70 text-[#8E3545] dark:text-rose-200 border border-[#C57B87]/60 text-xs font-extrabold tracking-wide shrink-0 shadow-xs disabled:opacity-45 transition-colors cursor-pointer">
                Enviar Solicitud de Equipo
              </button>
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
  showRegisterPassword = signal<boolean>(false);
  feedbackMessage = signal<string>('');
  errorMessage = signal<string>('');

  pronounsList = ['Ella', 'Elle', 'Él'];

  loginForm: FormGroup = this.fb.group({
    email: ['nayeli.coach@mujeresdiversas.mx', [Validators.required, Validators.email]],
    password: ['12345678', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  recoverForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  registerForm: FormGroup = this.fb.group({
    teamName: ['', [Validators.required]],
    jerseyColor: ['', [Validators.required]],
    teamCode: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    shirtName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    dorsal: [10, [Validators.required, Validators.min(1), Validators.max(99)]],
    position: ['Media', [Validators.required]],
    pronouns: ['Ella', [Validators.required]],
    playerStatus: ['Alta nueva', [Validators.required]],
    photoAuthorized: [true],
    privacyAccepted: [false, [Validators.requiredTrue]]
  });

  ngOnInit(): void {
    const viewParam = this.route.snapshot.data?.['view'] as ActiveView | undefined;
    if (viewParam) {
      this.activeView.set(viewParam);
    }
  }

  selectLoginRole(role: LoginRoleTab): void {
    this.selectedLoginRole.set(role);
    this.errorMessage.set('');
    const defaultEmails: Record<LoginRoleTab, string> = {
      ADMIN: 'nayeli.coach@mujeresdiversas.mx',
      CAPTAIN: 'val.rios@queergoals.mx'
    };
    this.loginForm.patchValue({ email: defaultEmails[role] });
  }

  togglePhotoAuthorization(): void {
    const current = this.registerForm.get('photoAuthorized')?.value;
    this.registerForm.patchValue({ photoAuthorized: !current });
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;
    this.errorMessage.set('');

    const role = this.selectedLoginRole();
    const email = this.loginForm.value.email;

    const ok = this.authService.iniciarSesion(email, role);
    if (!ok) {
      this.errorMessage.set('Acceso denegado: solo el correo oficial de Nayeli puede iniciar sesión como Administradora.');
      return;
    }

    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  enterAsGuest(): void {
    this.authService.entrarComoInvitada();
    this.router.navigate(['/home']);
  }

  onRecoverSubmit(): void {
    if (this.recoverForm.invalid) return;
    const email = this.recoverForm.value.email;
    this.feedbackMessage.set(`Enlace de restablecimiento enviado a ${email}. Revisa tu bandeja.`);
    this.recoverForm.reset();
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) return;
    const teamName = this.registerForm.value.teamName;
    const registeredEmail = this.registerForm.value.email;

    this.feedbackMessage.set(
      `Solicitud de "${teamName}" enviada. Ya puedes iniciar sesión como Equipo con ${registeredEmail}.`
    );

    this.registerForm.reset({
      dorsal: 10,
      position: 'Media',
      pronouns: 'Ella',
      playerStatus: 'Alta nueva',
      photoAuthorized: true,
      privacyAccepted: false
    });

    setTimeout(() => {
      this.selectedLoginRole.set('CAPTAIN');
      this.loginForm.patchValue({ email: registeredEmail, password: '' });
      this.router.navigate(['/login']);
    }, 2000);
  }
}