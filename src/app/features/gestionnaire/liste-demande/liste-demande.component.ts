import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SinistreService } from '../../../core/services/sinistre.service';
import { Sinistre } from '../../../core/models/sinistre.model';

@Component({
  selector: 'app-liste-demande',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './liste-demande.component.html',
  styleUrl: './liste-demande.component.css'
})
export class ListeDemandeComponent {
  sinistres: Sinistre[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private sinistreService: SinistreService) {}

  ngOnInit(): void {
    this.sinistreService.sinistresDuGestionnaire().subscribe({
      next: (sinistres) => {
        this.sinistres = sinistres;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les demandes de vos assurés.';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }

  getInitials(sinistre: Sinistre): string {
    const assure = sinistre.assure;
    return `${assure?.prenom?.charAt(0) ?? ''}${assure?.nom?.charAt(0) ?? ''}`.toUpperCase() || '--';
  }

  getAssureName(sinistre: Sinistre): string {
    return `${sinistre.assure?.prenom ?? ''} ${sinistre.assure?.nom ?? ''}`.trim() || 'Assuré inconnu';
  }

}
