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
  
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  get passwordStrength(): { text: string, class: string, width: string } {
    if (!this.newPassword) return { text: 'Faible', class: 'text-red-500', width: '0%' };
    
    let strength = 0;
    if (this.newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(this.newPassword)) strength++;
    if (/[0-9]/.test(this.newPassword)) strength++;
    if (/[!@#\$%\^&\*]/.test(this.newPassword)) strength++;

    if (strength <= 1) return { text: 'Faible', class: 'text-red-500', width: '25%' };
    if (strength === 2 || strength === 3) return { text: 'Moyen', class: 'text-amber-500', width: '50%' };
    return { text: 'Fort', class: 'text-emerald-500', width: '100%' };
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
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
        this.successMessage = res.message;
        
        // Redirection vers le dashboard après 2 secondes
        setTimeout(() => {
          const user = this.authService.getUser();
          if (user.role === 'Administrateur' || user.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'Gestionnaire') {
            this.router.navigate(['/gestionnaire']);
          } else if (user.role === 'Assure') {
            this.router.navigate(['/assure']);
          } else {
            this.router.navigate(['/profil']);
          }
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du changement de mot de passe.';
      }
    });
  }
}
