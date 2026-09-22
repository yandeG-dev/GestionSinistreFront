import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Remboursement } from '../models/remboursement.model';
import { Sinistre } from '../models/sinistre.model';

@Injectable({
  providedIn: 'root'
})
export class RemboursementService {
  private sinistresUrl = `${environment.apiUrl}/sinistres`;

  constructor(private http: HttpClient) { }

  getRemboursements(): Observable<Remboursement[]> {
    // Le token est injecté automatiquement par AuthInterceptor
    return this.http.get<Sinistre[]>(this.sinistresUrl).pipe(
      map(sinistres => this.mapSinistresToRemboursements(sinistres))
    );
  }

  private mapSinistresToRemboursements(sinistres: Sinistre[]): Remboursement[] {
    return sinistres
      .filter(s => ['Indemnisé', 'Clôturé', 'En traitement'].includes(s.statut))
      .map(s => {
        let statutRemboursement = 'En attente';
        let montant = 0;

        if (s.statut === 'Indemnisé' || s.statut === 'Clôturé') {
          statutRemboursement = 'Verse';
          montant = 350000;
        } else if (s.statut === 'En traitement') {
          statutRemboursement = 'En attente';
          montant = 120000;
        }

        return {
          id: s.id,
          numeroDossier: s.numeroDossier,
          typeSinistre: s.typeSinistre,
          montant: montant,
          dateVirement: s.dateSinistre,
          statutRemboursement: statutRemboursement
        };
      });
  }
}

