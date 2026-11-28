import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CoachingService {
  discipline: string;
  badgeStyle: string;
  btnStyle: string;
  coachName: string;
  credentials: string;
  description: string;
}

@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrenamientos.html',
  styleUrl: './entrenamientos.css',
})
export class Entrenamientos {
  categories = [
    'Todos',
    'Fútbol',
    'Boxeo Femenino',
    'Karate',
    'Acondicionamiento Físico',
    'Atención Inclusiva',
  ];
  selectedCategory = signal('Todos');
  coachNotification = signal<string | null>(null);
  private notificationTimer?: ReturnType<typeof setTimeout>;

  services: CoachingService[] = [
    {
      discipline: 'Fútbol',
      badgeStyle: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-700',
      coachName: 'Nayeli — Fundadora & Head Coach',
      credentials: 'Entrenadora Certificada FMF • Especialista en Técnica Individual y Porteras',
      description:
        'Sesiones personalizadas o en grupos reducidos de control orientado, definición, visión táctica y preparación física específica para jugadoras de todos los niveles.',
    },
    {
      discipline: 'Boxeo Femenino',
      badgeStyle: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      btnStyle: 'bg-rose-600 hover:bg-rose-700',
      coachName: 'Coach Fernanda "Fer" Cruz',
      credentials: 'Ex-Seleccionada Estatal • Certificación en Boxeo Olímpico y Defensa Personal',
      description:
        'Entrenamiento dinámico de técnica de golpeo, juego de pies, coordinación, liberación de estrés y acondicionamiento cardiovascular en un ambiente sororo y seguro.',
    },
    {
      discipline: 'Karate',
      badgeStyle: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      btnStyle: 'bg-blue-700 hover:bg-blue-800',
      coachName: 'Sensei Akemi Tanaka',
      credentials: 'Cinta Negra 3.er Dan Karate Do • Instructora de Defensa Personal Integral',
      description:
        'Disciplina marcial enfocada en equilibrio, concentración mental, postura, elasticidad y técnicas prácticas de autodefensa para mujeres y diversidades.',
    },
    {
      discipline: 'Acondicionamiento Físico',
      badgeStyle: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      btnStyle: 'bg-orange-600 hover:bg-orange-700',
      coachName: 'Coach Mariana Solís',
      credentials: 'Lic. en Ciencias del Deporte • Prevención de Lesiones y Fuerza Funcional',
      description:
        'Rutinas progresivas de fuerza, resistencia, movilidad articular y prevención de lesiones de rodilla y tobillo pensadas para alto rendimiento o bienestar general.',
    },
    {
      discipline: 'Atención Inclusiva',
      badgeStyle: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      btnStyle: 'bg-purple-600 hover:bg-purple-700',
      coachName: 'Programa a Domicilio & Movilidad Adaptada',
      credentials: 'Atención Especializada • Adultos Mayores, Padecimientos Físicos y Discapacidad',
      description:
        'Acompañamiento físico humano y empático directamente en tu domicilio. Sesiones diseñadas para rehabilitación suave, movilidad asistida y fortalecimiento seguro.',
    },
  ];

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'Todos' ? this.services : this.services.filter((s) => s.discipline === cat);
  });

  contactCoach(_coachName?: string): void {
    this.coachNotification.set('Poniéndote en contacto');

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notificationTimer = setTimeout(() => {
      this.coachNotification.set(null);
    }, 3500);
  }
}
