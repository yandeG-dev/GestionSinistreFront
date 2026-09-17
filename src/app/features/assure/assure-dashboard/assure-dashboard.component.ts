import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SinistreService } from '../../../core/services/sinistre.service';
import { Sinistre } from '../../../core/models/sinistre.model';

@Component({
  selector: 'app-assure-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assure-dashboard.component.html',
  styleUrl: './assure-dashboard.component.css'
})
export class AssureDashboardComponent implements OnInit {
  user: any = null;
  contrat: any = null;
  sinistres: Sinistre[] = [];
  joursRestants: number = 0;
  progressPercent: number = 0;

  constructor(private authService: AuthService, private sinistreService: SinistreService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadContrat();
    this.loadSinistres();
  }

  get initiales(): string {
    if (!this.user) return '--';
    return ((this.user.prenom?.[0] || '') + (this.user.nom?.[0] || '')).toUpperCase();
  }

  get nomComplet(): string {
    if (!this.user) return '';
    return `${this.user.prenom} ${this.user.nom}`;
  }

  loadContrat(): void {
    this.sinistreService.getContratsAssure()
      .subscribe({
        next: (contrats: any[]) => {
          this.contrat = contrats?.[0] ?? null;
          if (this.contrat) {
            const debut = new Date(this.contrat.dateDebut);
            const fin = new Date(this.contrat.dateFin);
            const now = new Date();
            const total = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24);
            const ecoule = (now.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24);
            this.joursRestants = Math.max(0, Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            this.progressPercent = Math.min(100, Math.round((ecoule / total) * 100));
          }
        },
        error: () => { this.contrat = null; }
      });
  }

  loadSinistres(): void {
    this.sinistreService.mesSinistres()
      .subscribe({
        next: (data: Sinistre[]) => { this.sinistres = data; },
        error: () => { this.sinistres = []; }
      });
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'En attente': 'bg-amber-50 text-amber-700 border border-amber-200',
      'En cours': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Cloture': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rembourse': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rejete': 'bg-red-50 text-red-700 border border-red-200',
      'Archive': 'bg-slate-100 text-slate-500 border border-slate-200',
    };
    return map[statut] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatMontant(val: number): string {
    if (!val) return '—';
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  }
}

