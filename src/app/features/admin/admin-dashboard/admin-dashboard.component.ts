import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;
  
  roleCounts?: {
    ADMINISTRATEUR: number;
    AGENT: number;
    EXPERT: number;
    GESTIONNAIRE: number;
    COMPTABLE: number;
  } = {
    ADMINISTRATEUR: 0,
    AGENT: 0,
    EXPERT: 0,
    GESTIONNAIRE: 0,
    COMPTABLE: 0
  };

  ngOnInit() {
    // Mock data based on the lists to populate the dashboard
    const users = [
      { id: 1, role: 'ADMINISTRATEUR', status: 'Actif' },
      { id: 2, role: 'AGENT', status: 'Actif' },
      { id: 3, role: 'EXPERT', status: 'Inactif' },
      { id: 4, role: 'COMPTABLE', status: 'Actif' },
      { id: 5, role: 'GESTIONNAIRE', status: 'Actif' },
    ];

    this.totalUsers = users.length;
    this.activeUsers = users.filter(u => u.status === 'Actif').length;
    this.inactiveUsers = users.filter(u => u.status === 'Inactif').length;

    users.forEach(user => {
      const role = user.role as keyof NonNullable<typeof this.roleCounts>;
      if (this.roleCounts![role] !== undefined) {
        this.roleCounts![role]++;
      }
    });
  }
}
