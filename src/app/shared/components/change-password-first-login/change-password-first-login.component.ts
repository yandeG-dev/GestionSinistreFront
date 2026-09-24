import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-first-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password-first-login.component.html',
  styleUrl: './change-password-first-login.component.css'
})
export class ChangePasswordFirstLoginComponent {
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

  constructor(private authService: AuthService, private router: Router) {}

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

    if (strength <= 1) return { text: 'Faible', class: 'text-red-500', width: '25%' };
    if (strength === 2 || strength === 3) return { text: 'Moyen', class: 'text-amber-500', width: '50%' };
    return { text: 'Fort', class: 'text-emerald-500', width: '100%' };
  }

  private redirectToDashboard(): void {
    const user = this.authService.getUser();
    const role = user?.role;

    if (role === 'Administrateur' || role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Gestionnaire') {
      this.router.navigate(['/gestionnaire']);
    } else if (role === 'Assure') {
      this.router.navigate(['/assure']);
    } else {
      this.router.navigate(['/profil']);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isPasswordValid) {
      this.errorMessage = 'Le mot de passe ne respecte pas toutes les exigences de sécurité.';
      return;
    }

    this.isLoading = true;

    const payload = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Mot de passe changé avec succès.';

        const user = this.authService.getUser();
        if (user) {
          user.doit_changer_mdp = false;
          localStorage.setItem('user', JSON.stringify(user));
        }

        setTimeout(() => this.redirectToDashboard(), 800);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).flat().join('\n');
        } else {
          this.errorMessage = err.error?.message || 'Erreur lors du changement de mot de passe.';
        }
      }
    });
  }
}
