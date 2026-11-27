import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RadarStats {
  Ataque: number;
  Fisico: number;
  Velocidad: number;
  Pase: number;
  Regate: number;
  Defensa: number;
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 350 290" class="w-full max-w-[340px] mx-auto select-none">
      <defs>
        <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.26" />
          <stop offset="50%" stop-color="#EAB308" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.28" />
        </linearGradient>
        <linearGradient id="radarStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="50%" stop-color="#EAB308" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
      </defs>

      @for (poly of gridPolygons(); track $index) {
        <polygon
          [attr.points]="poly"
          fill="none"
          stroke="currentColor"
          class="text-slate-200 dark:text-[#282D39]"
          stroke-width="1"
        />
      }

      @for (axis of axes(); track $index) {
        <line
          [attr.x1]="cx"
          [attr.y1]="cy"
          [attr.x2]="axis.x"
          [attr.y2]="axis.y"
          stroke="currentColor"
          class="text-slate-200 dark:text-[#282D39]"
          stroke-width="1"
        />
      }

      <polygon
        [attr.points]="dataPolygon()"
        fill="url(#radarFillGrad)"
        stroke="url(#radarStrokeGrad)"
        stroke-width="2.2"
        stroke-linejoin="round"
      />

      @for (item of vertices(); track item.label) {
        <circle
          [attr.cx]="item.px"
          [attr.cy]="item.py"
          r="4.5"
          [attr.fill]="accentColor()"
          stroke="#FFFFFF"
          stroke-width="1.5"
        />
        <text
          [attr.x]="item.lx"
          [attr.y]="item.ly - 3"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-slate-600 dark:fill-slate-300 text-[11px] font-semibold"
        >
          {{ item.label }}
        </text>
        <text
          [attr.x]="item.lx"
          [attr.y]="item.ly + 10"
          text-anchor="middle"
          dominant-baseline="middle"
          [attr.fill]="accentColor()"
          class="text-[10px] font-extrabold"
        >
          {{ item.value }}
        </text>
      }
    </svg>
  `,
})
export class RadarChartComponent {
  stats = input.required<RadarStats>();
  accentColor = input<string>('#8B5CF6');

  readonly cx = 175;
  readonly cy = 145;
  readonly maxR = 92;

  private readonly keys: { key: keyof RadarStats; label: string }[] = [
    { key: 'Ataque', label: 'Ataque' },
    { key: 'Fisico', label: 'Físico' },
    { key: 'Velocidad', label: 'Velocidad' },
    { key: 'Pase', label: 'Pase' },
    { key: 'Regate', label: 'Regate' },
    { key: 'Defensa', label: 'Defensa' },
  ];

  private getPoint(index: number, value: number) {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    const r = (value / 100) * this.maxR;
    return {
      x: +(this.cx + r * Math.cos(angle)).toFixed(1),
      y: +(this.cy + r * Math.sin(angle)).toFixed(1),
    };
  }

  readonly gridPolygons = computed(() =>
    [25, 50, 75, 100].map((lvl) =>
      this.keys
        .map((_, i) => {
          const p = this.getPoint(i, lvl);
          return `${p.x},${p.y}`;
        })
        .join(' '),
    ),
  );

  readonly axes = computed(() => this.keys.map((_, i) => this.getPoint(i, 100)));

  readonly vertices = computed(() => {
    const data = this.stats();
    return this.keys.map((item, i) => {
      const val = data[item.key] ?? 75;
      const pt = this.getPoint(i, val);
      const labelPt = this.getPoint(i, 122);
      return {
        label: item.label,
        value: val,
        px: pt.x,
        py: pt.y,
        lx: labelPt.x,
        ly: labelPt.y,
      };
    });
  });

  readonly dataPolygon = computed(() =>
    this.vertices()
      .map((v) => `${v.px},${v.py}`)
      .join(' '),
  );
}