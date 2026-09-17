import { Component } from '@angular/core';
import { UserService, User } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-liste-assure',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './liste-assure.component.html',
  styleUrl: './liste-assure.component.css'
})
export class ListeAssureComponent {
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  showAddUserModal: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.errorMessage = 'Impossible de charger les utilisateurs. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const fullName = (user.prenom + ' ' + user.nom).toLowerCase();
      const matchSearch = this.searchTerm
        ? fullName.includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.telephone || '').includes(this.searchTerm)
        : true;
      const matchRole = this.selectedRole ? user.role?.toUpperCase() === this.selectedRole : true;
      const matchStatus = this.selectedStatus ? user.statut === this.selectedStatus : true;
      return matchSearch && matchRole && matchStatus;
    });
  }

  formatName(user: User): string { return `${user.prenom} ${user.nom}`; }
  formatInitials(user: User): string { return (user.prenom?.charAt(0) + user.nom?.charAt(0)).toUpperCase(); }
  formatEmailPrefix(user: User): string { return user.email?.split('@')[0] ?? ''; }
  formatEmailDomain(user: User): string { return user.email?.split('@')[1] ?? ''; }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  openAddUserModal(): void {
    this.showAddUserModal = true;
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
  }

  successMessage: string = '';
  tempPassword: string = '';

  saveUser(userData: any): void {
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        this.closeAddUserModal();
        this.loadUsers(); // Rechargement depuis l'API

        this.successMessage = response.message || 'Utilisateur créé avec succès.';
        this.tempPassword = response.mot_de_passe_temporaire || '';

        // Disparition du message après un certain temps, sauf s'il y a un mot de passe temporaire à copier
        if (!this.tempPassword) {
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        if (err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).flat().join('\n');
        } else {
          this.errorMessage = err.error?.message || 'Erreur lors de la création de l\'utilisateur.';
        }
        this.closeAddUserModal();
      }
    });
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
    this.tempPassword = '';
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
    // TODO: ouvrir une modale d'édition
  }

  toggleStatus(user: User): void {
    this.userService.toggleStatus(user.id).subscribe({
      next: (res) => {
        user.statut = res.user.statut;
      },
      error: (err) => console.error('Erreur toggle statut:', err)
    });
  }

  archiveUser(user: User): void {
    if (!confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
      },
      error: (err) => console.error('Erreur suppression:', err)
    });
  }
}
