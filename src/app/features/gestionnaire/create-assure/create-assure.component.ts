import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-create-assure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-assure.component.html',
  styleUrl: './create-assure.component.css'
})
export class CreateAssureComponent implements OnInit {
  assureForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire avec tous les champs requis par le backend
    this.assureForm = this.fb.group({
      // Infos Client
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      adresse: ['', [Validators.required]],

      // Infos Voiture
      immatriculation: ['', [Validators.required]],
      marque_vehicule: ['', [Validators.required]],
      modele_vehicule: ['', [Validators.required]],
      numero_chassis: [''], // Optionnel dans l'UI mais utile

      // Infos Contrat
      numeroContrat: [`CTR-${new Date().getFullYear()}-AUTO-${Math.floor(Math.random() * 900) + 100}`, [Validators.required]],
      policeAssurance: [`POL-${Math.floor(Math.random() * 90000) + 10000}`, [Validators.required]],
      typeContrat: ['Tous Risques', [Validators.required]],
      garantie: ['Garantie Complète (Vol + Incendie + Bris de glace)', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      prime: ['', [Validators.required, Validators.min(0)]],
      franchise: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.assureForm.invalid) {
      this.assureForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createAssure(this.assureForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Assuré et contrat créés avec succès !';
        this.isSubmitting = false;
        // Redirection après 1.5s
        setTimeout(() => {
          this.router.navigate(['/liste-assure']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur de création:', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création.';
        this.isSubmitting = false;
      }
    });
  }
}

