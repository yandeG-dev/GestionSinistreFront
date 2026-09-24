import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private readonly specialCharPattern = /[!@#$%^&*]/;

  constructor(private authService: AuthService) { }

  get hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get hasSpecial(): boolean {
    return this.specialCharPattern.test(this.newPassword);
  }

  get passwordsMatch(): boolean {
    return !!this.confirmPassword && this.newPassword === this.confirmPassword;
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUppercase && this.hasNumber && this.hasSpecial && this.passwordsMatch;
  }

  get passwordStrength(): { text: string, class: string, width: string } {
    if (!this.newPassword) return { text: 'Faible', class: 'text-red-500', width: '0%' };

    let strength = 0;
    if (this.hasMinLength) strength++;
    if (this.hasUppercase) strength++;
    if (this.hasNumber) strength++;
    if (this.hasSpecial) strength++;

    if (strength <= 1) return { text: 'Faible', class: 'text-red-500', width: '33%' };
    if (strength === 2 || strength === 3) return { text: 'Moyen', class: 'text-amber-500', width: '66%' };
    return { text: 'Fort', class: 'text-emerald-500', width: '100%' };
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isPasswordValid) {
      this.errorMessage = 'Le mot de passe ne respecte pas toutes les exigences de sécurité.';
      return;
    }

    this.isLoading = true;

    const data = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.authService.changePassword(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Mot de passe modifié avec succès.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        const user = this.authService.getUser();
        if (user) {
          user.doit_changer_mdp = false;
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join('\n');
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la modification du mot de passe.';
        }
      }
    });
  }
}
