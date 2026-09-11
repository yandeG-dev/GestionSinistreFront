import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SinistreService } from '../../../../shared/services/sinistre.service';

@Component({
  selector: 'app-info-sinistre',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './info-sinistre.component.html',
  styleUrl: './info-sinistre.component.css'
})
export class InfoSinistreComponent implements OnInit {
  
  formData = {
    typeSinistre: '',
    dateSinistre: '',
    heureSinistre: '',
    lieuSinistre: '',
    description: ''
  };

  constructor(
    private sinistreService: SinistreService,
    private router: Router
  ) {}

  ngOnInit() {
    // Plus besoin de charger les contrats, le gestionnaire l'associera plus tard
  }

  onSubmit() {
    if (!this.formData.typeSinistre || !this.formData.dateSinistre || !this.formData.lieuSinistre || !this.formData.description) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    
    // Sauvegarder dans le service pour l'étape suivante
    this.sinistreService.setSinistreData(this.formData);
    
    // Naviguer vers l'étape des pièces justificatives
    this.router.navigate(['/declaration/pieces-justificatives']);
  }
}


