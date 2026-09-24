import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { ListeUsersComponent } from './features/admin/liste-users/liste-users.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ProfilComponent } from './shared/components/profil/profil.component';
import { TwoFactorAuthComponent } from './shared/components/two-factor-auth/two-factor-auth.component';
import { ListeDemandeComponent } from './features/gestionnaire/liste-demande/liste-demande.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'two-factor-auth', component: TwoFactorAuthComponent },
  { path: 'first-login', loadComponent: () => import('./shared/components/change-password-first-login/change-password-first-login.component').then(m => m.ChangePasswordFirstLoginComponent) },
  {
    path: '',
    component: SidebarComponent,
    children: [
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'gestionnaire', loadComponent: () => import('./features/gestionnaire/gestionnaire-dashboard/gestionnaire-dashboard.component').then(m => m.GestionnaireDashboardComponent) },
      { path: 'liste-demande', loadComponent: () => import('./features/gestionnaire/liste-demande/liste-demande.component').then(m => m.ListeDemandeComponent) },
      { path: 'liste-assure', loadComponent: () => import('./features/gestionnaire/liste-assure/liste-assure.component').then(m => m.ListeAssureComponent) },
      { path: 'utilisateurs', component: ListeUsersComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'change-password', loadComponent: () => import('./shared/components/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      { path: 'create-assure', loadComponent: () => import('./features/gestionnaire/create-assure/create-assure.component').then(m => m.CreateAssureComponent) },
      { path: 'assure', loadComponent: () => import('./features/assure/assure-dashboard/assure-dashboard.component').then(m => m.AssureDashboardComponent) },
      { path: 'declaration/info-sinistre', loadComponent: () => import('./features/assure/declaration/info-sinistre/info-sinistre.component').then(m => m.InfoSinistreComponent) },
      { path: 'declaration/pieces-justificatives', loadComponent: () => import('./features/assure/declaration/pieces-justificatives/pieces-justificatives.component').then(m => m.PiecesJustificativesComponent) },
      { path: 'declaration/confirmation', loadComponent: () => import('./features/assure/declaration/confirmation/confirmation.component').then(m => m.ConfirmationComponent) },
      { path: 'mes-sinistres', loadComponent: () => import('./features/assure/liste-sinistre/liste-sinistre.component').then(m => m.ListeSinistreComponent) },
      { path: 'mes-remboursements', loadComponent: () => import('./features/assure/liste-remboursement/liste-remboursement.component').then(m => m.ListeRemboursementComponent) },
      { path: 'detail-sinistre/:id', loadComponent: () => import('./shared/components/detail-sinistre/detail-sinistre.component').then(m => m.DetailSinistreComponent) },
    ]
  },
];


