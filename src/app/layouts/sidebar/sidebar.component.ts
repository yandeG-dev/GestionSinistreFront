import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  isAdmin(): boolean {
    const role = this.currentUser?.role?.toUpperCase();
    return role === 'ADMINISTRATEUR' || role === 'ADMIN';
  }

  isGestionnaire(): boolean {
    const role = this.currentUser?.role?.toUpperCase();
    return role === 'GESTIONNAIRE';
  }

  isAssure(): boolean {
    const role = this.currentUser?.role?.toUpperCase();
    return role === 'ASSURE' || role === 'ASSURÉ';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/connexion']);
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/connexion']);
      }
    });
  }
}
