// 1. Flujos de Acceso y Registro (Sin Sidebar ni Topbar)
  {
    path: 'login',
    data: { view: 'LOGIN' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then((m) => m.AuthRegisterPageComponent),
  },
  {
    path: 'registro-jugadora',
    data: { view: 'REGISTER_PLAYER' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then((m) => m.AuthRegisterPageComponent),
  },
  {
    path: 'registro-equipo',
    data: { view: 'REGISTER_TEAM' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then((m) => m.AuthRegisterPageComponent),
  },
  {
    path: 'recuperar-password',
    data: { view: 'RECOVER' },
    loadComponent: () =>
      import('./features/auth-admin/auth-register-page/auth-register-page')
        .then((m) => m.AuthRegisterPageComponent),
  },

  // 2. Vistas principales Dev 3
  { path: 'home', component: Home },
  {
    path: 'entrenamientos',
    loadComponent: () =>
      import('./pages/entrenamientos/entrenamientos').then((m) => m.Entrenamientos),
  },

  // 3. Panel de Administración y Cédula Arbitral (Dev 2)
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/auth-admin/admin-panel-page/admin-panel-page')
        .then((m) => m.AdminPanelPageComponent),
  },

  // 4. Rutas temporales mientras Dev 1 sube sus páginas:
  { path: 'torneo', component: Home },
  { path: 'jugadora/:id', component: Home },

  // Comodín siempre al final:
  { path: '**', redirectTo: 'home' },
];