import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const data = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.authService.changePassword(data).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Mot de passe modifié avec succès.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        // Mettre à jour l'utilisateur dans le local storage pour refléter qu'il n'a plus à changer son MDP
        const user = this.authService.getUser();
        if (user) {
          user.doit_changer_mdp = false;
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: (error) => {
        if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join('\n');
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification du mot de passe.';
        }
      }
    });
  }
}
