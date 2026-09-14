import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SinistreService } from '../../../../shared/services/sinistre.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {
  lastResponse: any = null;
  sinistreDetails: any = null;
  fichiersJoints: any[] = [];

  constructor(
    private sinistreService: SinistreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.lastResponse = this.sinistreService.getLastSinistreResponse();
    if (!this.lastResponse || !this.lastResponse.sinistre) {
      // Si on arrive ici directement, on redirige vers le dashboard
      this.router.navigate(['/assure']);
    } else {
      this.sinistreDetails = this.lastResponse.sinistre;
      this.fichiersJoints = this.lastResponse.fichiers_joints || [];
      // On nettoie le service car la déclaration est finie
      this.sinistreService.clearLastSinistreResponse();
      this.sinistreService.clearSinistreData();
    }
  }
}

