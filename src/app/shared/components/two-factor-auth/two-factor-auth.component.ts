import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.css'
})
export class TwoFactorAuthComponent implements OnInit, OnDestroy {
  code: string[] = ['', '', '', '', '', ''];
  email: string = '';
  errorMessage: string = '';
  remainingSeconds = 10 * 60;

  private countdownTimer?: ReturnType<typeof setInterval>;

  constructor(private authService: AuthService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['email']) {
      this.email = navigation.extras.state['email'];
    }
  }

  ngOnInit(): void {
    this.countdownTimer = setInterval(() => {
      if (this.remainingSeconds === 0) {
        this.stopCountdown();
        return;
      }

      this.remainingSeconds--;
    }, 1000);

    // Optionally redirect to login if no email is found
    // if (!this.email) { this.router.navigate(['/login']); }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  get formattedRemainingTime(): string {
    const minutes = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  private stopCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  onInput(event: any, index: number) {
    const input = event.target;
    if (input.value && index < 5) {
      const nextSibling = input.nextElementSibling;
      if (nextSibling) {
        nextSibling.focus();
      }
    }
  }

  onKeyDown(event: any, index: number) {
    const input = event.target;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevSibling = input.previousElementSibling;
      if (prevSibling) {
        prevSibling.focus();
      }
    }
  }

  onSubmit() {
    this.errorMessage = '';
    const fullCode = this.code.join('');
    if (fullCode.length === 6) {
      if (!this.email) {
        this.errorMessage = 'Email non trouvé, veuillez vous reconnecter.';
        return;
      }
      this.authService.verify2fa(this.email, fullCode).subscribe({
        next: (response) => {
          const user = this.authService.getUser();
          if (user) {
            if (user.doit_changer_mdp) {
              this.router.navigate(['/change-password']);
            } else if (user.role === 'Administrateur' || user.role === 'Admin') {
              this.router.navigate(['/admin']);
            } else if (user.role === 'Gestionnaire') {
              this.router.navigate(['/gestionnaire']);
            } else if (user.role === 'Assure') {
              this.router.navigate(['/assure']);
            } else if (user.role === 'Expert') {
              this.router.navigate(['/expert']);
            } else if (user.role === 'Comptable') {
              this.router.navigate(['/comptable']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Code incorrect ou expiré';
        }
      });
    } else {
      this.errorMessage = 'Veuillez saisir les 6 chiffres du code.';
    }
  }
}
