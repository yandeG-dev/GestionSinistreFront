import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SinistreService } from '../../../core/services/sinistre.service';
import { Sinistre } from '../../../core/models/sinistre.model';

@Component({
  selector: 'app-liste-sinistre',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './liste-sinistre.component.html',
  styleUrl: './liste-sinistre.component.css'
})
export class ListeSinistreComponent implements OnInit {
  user: any = null;
  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  statutFilter: string = 'Tous';
  searchQuery: string = '';

  constructor(
    private sinistreService: SinistreService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadSinistres();
  }



  loadSinistres(): void {
    this.sinistreService.mesSinistres()
      .subscribe({
        next: (data: Sinistre[]) => {
          this.sinistres = data;
          this.filteredSinistres = data;
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des sinistres', err);
        }
      });
  }

  filterSinistres(statut: string): void {
    this.statutFilter = statut;
    this.applyFilters();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.sinistres;

    if (this.statutFilter !== 'Tous') {
      result = result.filter(s => s.statut === this.statutFilter);
    }

    if (this.searchQuery) {
      result = result.filter(s =>
        s.numeroDossier?.toLowerCase().includes(this.searchQuery) ||
        (s as any).contrat?.vehicule?.immatriculation?.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredSinistres = result;
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'En attente': 'bg-slate-100 text-slate-600 border border-slate-200',
      'En cours': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Archive': 'bg-slate-100 text-slate-500 border border-slate-200',
    };
    return map[statut] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getStatutCount(statut: string): number {
    if (statut === 'Tous') return this.sinistres.length;
    return this.sinistres.filter(s => s.statut === statut).length;
  }
}
