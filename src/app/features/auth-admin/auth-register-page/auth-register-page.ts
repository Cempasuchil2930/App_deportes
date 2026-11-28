import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SolicitudesEquiposService } from '../../../shared/services/solicitudes-equipos';

type ActiveView = 'LOGIN' | 'REGISTER_TEAM' | 'RECOVER';
type LoginRoleTab = 'ADMIN' | 'CAPTAIN';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './auth-register-page.css',
  templateUrl: './auth-register-page.html',
})
export class AuthRegisterPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private solicitudesService = inject(SolicitudesEquiposService);

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
    rememberMe: [true],
  });

  recoverForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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
    privacyAccepted: [false, [Validators.requiredTrue]],
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
      CAPTAIN: 'val.rios@queergoals.mx',
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
      this.errorMessage.set(
        'Acceso denegado: solo el correo oficial de Nayeli puede iniciar sesión como Administradora.',
      );
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

    const v = this.registerForm.value;
    const codigo = String(v.teamCode).trim().toUpperCase();

    this.solicitudesService.agregarSolicitud({
      nombreEquipo: `${String(v.teamName).trim()} (${codigo})`,
      colorDistintivo: String(v.jerseyColor).trim(),
      abreviatura: codigo,
      capitana: String(v.fullName).trim(),
      correo: String(v.email).trim(),
      apodo: String(v.shirtName || '').trim(),
      dorsal: Number(v.dorsal),
      posicion: v.position,
      pronombres: v.pronouns,
      fotoAutorizada: Boolean(v.photoAuthorized),
    });

    this.feedbackMessage.set(
      `Solicitud enviada para ${String(v.teamName).trim()}. Coach Nayeli la revisará pronto.`,
    );
    this.registerForm.reset({
      dorsal: 10,
      position: 'Media',
      pronouns: 'Ella',
      playerStatus: 'Alta nueva',
      photoAuthorized: true,
      privacyAccepted: false,
    });
  }
}
