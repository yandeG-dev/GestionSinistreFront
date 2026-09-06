import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser() || {};
  }

  toggle2FA() {
    const newState = !this.user.two_factor_enabled;
    // Inverse localement l'état pour l'UI immédiatement pour la réactivité
    this.user.two_factor_enabled = newState;

    this.authService.toggle2FA(newState).subscribe({
      next: (response) => {
        // La mise à jour est confirmée par le serveur
        this.user = response.user;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du 2FA', error);
        // On annule le changement local si l'API échoue
        this.user.two_factor_enabled = !newState;
      }
    });
  }
}
