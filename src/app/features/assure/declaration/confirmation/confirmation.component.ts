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
  sinistreDetails: any = null;

  constructor(
    private sinistreService: SinistreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sinistreDetails = this.sinistreService.getSinistreData();
    if (!this.sinistreDetails || !this.sinistreDetails.numeroDossier) {
      // Si on arrive ici directement, on redirige vers le dashboard
      this.router.navigate(['/assure']);
    } else {
      // On nettoie le service car la déclaration est finie
      this.sinistreService.clearSinistreData();
    }
  }
}

