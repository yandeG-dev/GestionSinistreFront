import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SinistreService } from '../../../core/services/sinistre.service';

@Component({
  selector: 'app-gestionnaire-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './gestionnaire-dashboard.component.html',
  styleUrl: './gestionnaire-dashboard.component.css'
})
export class GestionnaireDashboardComponent implements OnInit {
  stats: any = {
    totalAssures: 0,
    totalSinistres: 0,
    sinistresEnAttente: 0,
    sinistresEnCours: 0,
    totalExperts: 0,
    expertsDispo: 0,
    experts: [],
    sinistresParType: []
  };
  recentSinistres: any[] = [];
  isLoading = true;
  isLoadingSinistres = true;

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  constructor(private sinistreService: SinistreService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentSinistres();
  }

  loadRecentSinistres() {
    this.isLoadingSinistres = true;
    this.sinistreService.sinistresDuGestionnaire().subscribe({
      next: (data) => {
        this.recentSinistres = data.slice(0, 5); // Take top 5
        this.isLoadingSinistres = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sinistres récents', error);
        this.isLoadingSinistres = false;
      }
    });
  }

  loadStats() {
    this.isLoading = true;
    this.sinistreService.getGestionnaireDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
        this.isLoading = false;
      }
    });
  }
}
