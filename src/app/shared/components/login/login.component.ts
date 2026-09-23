import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.requires_2fa) {
          if (response.debug_code) {
            console.log('DEBUG CODE 2FA:', response.debug_code);
          }
          this.router.navigate(['/two-factor-auth'], { state: { email: this.email } });
        } else {
          // 2FA n'est pas requis, l'utilisateur est déjà connecté
          const user = response.user;
          if (user) {
            if (user.doit_changer_mdp) {
              this.router.navigate(['/first-login']);
            } else if (user.role === 'Administrateur' || user.role === 'Admin') {
              this.router.navigate(['/admin']);
            } else if (user.role === 'Gestionnaire') {
              this.router.navigate(['/gestionnaire']);
            } else if (user.role === 'Assure') {
              this.router.navigate(['/assure']);
            } else if (user.role === 'Expert') {
              this.router.navigate(['/profil']);
            } else if (user.role === 'Comptable') {
              this.router.navigate(['/profil']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Identifiants incorrects';
      }
    });
  }
}

