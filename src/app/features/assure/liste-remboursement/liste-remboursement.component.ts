import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RemboursementService } from '../../../core/services/remboursement.service';
import { Remboursement } from '../../../core/models/remboursement.model';

@Component({
  selector: 'app-liste-remboursement',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './liste-remboursement.component.html',
  styleUrl: './liste-remboursement.component.css'
})
export class ListeRemboursementComponent implements OnInit {
  user: any = null;
  remboursements: Remboursement[] = [];
  filteredRemboursements: Remboursement[] = [];
  statutFilter: string = 'Tous';
  searchQuery: string = '';

  totalRembourse = 0;
  totalAttente = 0;
  totalFranchise = 0;

  constructor(
    private remboursementService: RemboursementService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadRemboursements();
  }



  loadRemboursements(): void {
    this.remboursementService.getRemboursements()
      .subscribe({
        next: (data: Remboursement[]) => {
          this.remboursements = data;
          this.filteredRemboursements = data;
          this.calculateTotals();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des remboursements', err);
        }
      });
  }

  calculateTotals(): void {
    this.totalRembourse = this.remboursements.filter(r => r.statutRemboursement === 'Verse').reduce((sum, r) => sum + r.montant, 0);
    this.totalAttente = this.remboursements.filter(r => r.statutRemboursement === 'En attente').reduce((sum, r) => sum + r.montant, 0);
    this.totalFranchise = this.remboursements.length * 50000;
  }

  filterRemboursements(statut: string): void {
    this.statutFilter = statut;
    this.applyFilters();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.remboursements;

    if (this.statutFilter !== 'Tous') {
      result = result.filter(r => r.statutRemboursement === this.statutFilter);
    }

    if (this.searchQuery) {
      result = result.filter(r =>
        r.numeroDossier?.toLowerCase().includes(this.searchQuery) ||
        r.typeSinistre?.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredRemboursements = result;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatMontant(val: number): string {
    if (!val) return '0';
    return new Intl.NumberFormat('fr-FR').format(val);
  }

  getStatutCount(statut: string): number {
    if (statut === 'Tous') return this.remboursements.length;
    return this.remboursements.filter(r => r.statutRemboursement === statut).length;
  }
}
