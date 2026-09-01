import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
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
  code2fa = '';
  
  errorMessage = '';
  show2faStep = false;
  debugCode = ''; // Pour afficher le code en mode debug (comme dans le backend)

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.show2faStep = true;
        this.debugCode = response.debug_code || '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Identifiants incorrects';
      }
    });
  }

  onVerifySubmit() {
    this.errorMessage = '';
    this.authService.verify2fa(this.email, this.code2fa).subscribe({
      next: (response) => {
        const user = this.authService.getUser();
        if (user) {
          if (user.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'Gestionnaire') {
            this.router.navigate(['/gestionnaire']);
          } else if (user.role === 'Assure') {
            this.router.navigate(['/assure']);
          } else {
            this.router.navigate(['/']); // Fallback
          }
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Code incorrect ou expiré';
      }
    });
  }
}
