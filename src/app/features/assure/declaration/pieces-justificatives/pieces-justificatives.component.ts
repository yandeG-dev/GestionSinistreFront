import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SinistreService } from '../../../../core/services/sinistre.service';
import { DeclarerSinistreResponse } from '../../../../core/models/sinistre.model';

@Component({
  selector: 'app-pieces-justificatives',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pieces-justificatives.component.html',
  styleUrl: './pieces-justificatives.component.css'
})
export class PiecesJustificativesComponent {
  constatFile: File | null = null;
  photoFiles: File[] = [];
  permisFile: File | null = null;
  carteGriseFile: File | null = null;

  isSubmitting = false;

  constructor(
    private sinistreService: SinistreService,
    private router: Router
  ) { }

  onConstatSelected(event: any) {
    if (event.target.files.length > 0) {
      this.constatFile = event.target.files[0];
    }
  }

  removeConstat() {
    this.constatFile = null;
  }

  onPhotosSelected(event: any) {
    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      this.photoFiles.push(...files);
    }
  }

  removePhoto(index: number) {
    this.photoFiles.splice(index, 1);
  }

  onPermisSelected(event: any) {
    if (event.target.files.length > 0) {
      this.permisFile = event.target.files[0];
    }
  }

  removePermis() {
    this.permisFile = null;
  }

  onCarteGriseSelected(event: any) {
    if (event.target.files.length > 0) {
      this.carteGriseFile = event.target.files[0];
    }
  }

  removeCarteGrise() {
    this.carteGriseFile = null;
  }

  onSubmit() {
    const sinistreData = this.sinistreService.getSinistreData();
    if (!sinistreData) {
      alert("Données du sinistre manquantes. Veuillez recommencer.");
      this.router.navigate(['/declaration/info-sinistre']);
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    // Ajouter les champs texte en ignorant les valeurs vides (évite les erreurs de validation Laravel)
    Object.keys(sinistreData).forEach(key => {
      const typedKey = key as keyof typeof sinistreData;
      const value = sinistreData[typedKey];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    // Ajouter les fichiers sous "documents[]" pour que le backend les attrape tous
    if (this.constatFile) {
      formData.append('documents[]', this.constatFile, 'Constat_' + this.constatFile.name);
    }
    if (this.permisFile) {
      formData.append('documents[]', this.permisFile, 'Permis_' + this.permisFile.name);
    }
    if (this.carteGriseFile) {
      formData.append('documents[]', this.carteGriseFile, 'CarteGrise_' + this.carteGriseFile.name);
    }
    this.photoFiles.forEach((file, index) => {
      formData.append('documents[]', file, 'Photo' + (index + 1) + '_' + file.name);
    });

    this.sinistreService.declarerSinistre(formData).subscribe({
      next: (response: DeclarerSinistreResponse) => {
        this.isSubmitting = false;
        this.sinistreService.setSinistreData(response.sinistre);
        this.sinistreService.setLastSinistreResponse(response);
        this.router.navigate(['/declaration/confirmation']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Erreur déclaration sinistre:', err);
        if (err.status === 422 && err.error?.errors) {
          const messages = Object.values(err.error.errors).flat().join('\n');
          alert('Erreur de validation :\n' + messages);
        } else if (err.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
        } else {
          alert("Une erreur est survenue lors de l'envoi. Statut: " + err.status);
        }
      }
    });
  }
}

